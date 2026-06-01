// src/auth/jwt-auth.guard.ts
import { CanActivate, Injectable, ExecutionContext, HttpException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { Request } from 'express';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/enum/env.enum';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 检查是否是公开接口
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 如果是公开接口，直接放行
    if (isPublic) {
      return true;
    }
    // 2. 检查 Authorization 头是否存在且以 Bearer 开头
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')){
      throw new UnauthorizedException({
        message: '用户未登录',
        type: 'TOKEN_MISSING',
      });
    }
    // 3. 提取 token
    const token = authHeader.split(' ')[1];
    // 4. 校验 token
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get(Env.JWT_SECRET),
      });
      req.user = payload;
      // 5. 校验通过，返回 true
      return true;
    } catch (error) {
      // 6. 校验失败，抛出异常
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          message: '登录已过期',
          type: 'TOKEN_EXPIRED',
        });
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException({
          message: '无效的登录凭证',
          type: 'TOKEN_INVALID',
        });
      }
      throw new UnauthorizedException({
        message: '鉴权失败',
        type: 'AUTHENTICATION_FAILED',
      });
    }
  }
}