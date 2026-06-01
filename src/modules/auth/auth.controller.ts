import { Controller, Post, Req, Res, Body, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) { }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const accessToken = await this.authService.login(loginDto, res);
    return {data:accessToken}
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const accessToken = await this.authService.refreshTokens(req, res);
    return {data:accessToken}
  }

  @UseGuards(JwtAuthGuard)
  @Get('userInfo')
  async getUserInfo(
    @Req() req: Request,
  ) {
    const userInfo = await this.authService.getUserInfo(req);
    return {data:userInfo}
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const userId = (req.user as { id: string })?.id;
    const result = await this.authService.logout(userId, res);
    return result;
  }
}