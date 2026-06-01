import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Env } from '@/enum/env.enum';
import { Response, Request } from 'express';
import { RedisService } from '@/config/Redis/redis.service';
import { comparePassword } from '@/common/utils/bcrypt.utils';
import { ConfigService } from '@nestjs/config'; 
import { convertTimerToMs } from '@/common/utils/time.utils';
import { LoginDto } from './dto/create-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}
  // 生成双 Token
  async generateTokens(userId: string,username: string,tokenVersion: number){
    // payload 包含用户 ID、用户名和token版本号
    const payload = { 
      userId,
      username,
      tokenVersion
    };
    // 并发生成双 Token，使用不同的密钥和过期时间
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({...payload,type:'access'}, { 
        secret: this.configService.get(Env.JWT_SECRET),
        expiresIn: this.configService.get(Env.JWT_EXPIRES_IN) 
      }),
      this.jwtService.signAsync({...payload,type:'refresh'}, { 
        secret: this.configService.get(Env.JWT_REFRESH_SECRET),
        expiresIn: this.configService.get(Env.JWT_REFRESH_EXPIRES_IN) 
      }),
    ]);
    return { accessToken, refreshToken };
  }

  // 保存 RT 到 Redis（白名单，覆盖旧的）
  async saveRefreshToken(userId: string, refreshToken: string) {
    await this.redisService.set(
      `refresh_token:${userId}`,
      refreshToken,
      convertTimerToMs(this.configService.get(Env.JWT_REFRESH_EXPIRES_IN) as string)
    )
  }

  // 校验 RT 是否在白名单
  async validateRefreshToken(userId: string, cookiesRefreshToken: string) {
    const key = `refresh_token:${userId}`
    const redisRefreshToken = await this.redisService.get(key);
    return redisRefreshToken === cookiesRefreshToken;
  }

  // 删除 RT（登出/踢下线）
  async invalidateRefreshToken(userId: string) {
    await this.redisService.del(`refresh_token:${userId}`);
  }

  // 保存 RT 到 Cookie
  async saveRefreshTokenToCookie(res: Response, refreshToken: string) {
    res.cookie(
      this.configService.get(Env.COOKIES_REFRESH_TOKEN_NAME) as string,
      refreshToken,
      {
        httpOnly: true, // 防止客户端脚本访问
        secure: process.env.NODE_ENV === 'production', // 生产环境 HTTPS
        sameSite: 'lax', // 跨域配置
        path: '/', // 可在所有路径下访问
        domain: 'localhost', // 跨域配置
        maxAge: convertTimerToMs(this.configService.get(Env.JWT_REFRESH_EXPIRES_IN) as string) // RT 过期时间
      }
    );
  }

  // 从 Cookie 读取 RT
  async getRefreshTokenFromCookie(req: Request) {
    return req.cookies[this.configService.get(Env.COOKIES_REFRESH_TOKEN_NAME) as string];
  }

   // 1. 登录并签发双 Token
  async login(loginParams: LoginDto, res: Response) {
    // 校验用户名或者密码是否存在
    const user = await this.userRepository.findOne(
      { where: { username: loginParams.username },
      select: ['id', 'username', 'password','tokenVersion']}
    );
    if (!user || !(await comparePassword(loginParams.password, user.password))) {
      throw new HttpException('用户名或密码错误', 200)
    }
    // 生成双 Token
    const { accessToken, refreshToken } = await this.generateTokens(user.id,user.username,user.tokenVersion);
    // 保存 RT 到 Redis 白名单
    await this.saveRefreshToken(user.id, refreshToken);
    // 保存 RT 到 Cookie
    await this.saveRefreshTokenToCookie(res, refreshToken);
    return accessToken;
  }
  
  // 2. 刷新 Token (Token 轮换机制)
  async refreshTokens(req: Request, res: Response) {
    try{
      // 从 Cookie 读取 RefreshToken
      const cookiesRefreshToken = await this.getRefreshTokenFromCookie(req);
      if (!cookiesRefreshToken) {
       throw new UnauthorizedException('Refresh Token 不存在,请重新登录')
      }
      // 1. 校验 RT 签名
      const decoded = this.jwtService.verify(cookiesRefreshToken, { secret: this.configService.get(Env.JWT_REFRESH_SECRET) });
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Refresh Token 错误,请重新登录')
      }
      const userId = decoded.userId as string;
      // 2. 校验 Redis 白名单
      const isValid = await this.validateRefreshToken(userId, cookiesRefreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Refresh Token 无效或已过期,请重新登录') 
      }
      //  3. 生成新 AT + 新 RT
      const { accessToken, refreshToken } = await this.generateTokens(userId,decoded.username,decoded.tokenVersion);
      // 4. 更新 Redis 白名单
      await this.saveRefreshToken(userId, refreshToken);
      // 5. 更新 RT 到 Cookie
      await this.saveRefreshTokenToCookie(res, refreshToken);
      return accessToken;
    }catch(err){
      throw new UnauthorizedException('Refresh Token 刷新失败,请重新登录')
    }
  }

  // 获取用户信息
  async getUserInfo(req: Request) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('用户未登录,请重新登录')
    }
    // 校验用户是否存在
    const userEntity = await this.userRepository.findOne({ where: { id: user.userId } });
    if (!userEntity) {
      throw new HttpException('用户不存在', 200)
    }
    return userEntity;
  }


  // 3. 登出 (主动失效)
  async logout(userId: string, res: Response) {
    // 删除 Redis 中的 Refresh Token
    await this.invalidateRefreshToken(userId)
    // 清除客户端 Cookie
    res.clearCookie(this.configService.get(Env.COOKIES_REFRESH_TOKEN_NAME) as string);
    return { message: '登出成功' };
  }

  // 4. 强制踢人下线 (修改密码或管理员操作时调用)
  async forceLogout(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('用户不存在', 200)
    }
    user.tokenVersion += 1; // 版本号 +1
    await this.userRepository.save(user); // 更新数据库
    await this.invalidateRefreshToken(userId); // 删除 Redis 中的 Refresh Token
  }
}