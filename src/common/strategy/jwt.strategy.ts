// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/enum/env.enum';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中提取 JWT
      ignoreExpiration: false, // 不忽略过期时间
      secretOrKey: configService.get(Env.JWT_SECRET) as string, 
    });
  }
  // 如果 JWT 签名和有效期校验通过，会自动调用此方法，并将 payload 注入到 req.user
  async validate(payload: any) {
     // 这里可以进一步查询数据库确认用户状态是否正常
    return payload
  }
}