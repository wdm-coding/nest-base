import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '@/common/strategy/jwt.strategy';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/enum/env.enum';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(Env.JWT_SECRET), 
        signOptions: { 
          expiresIn: configService.get(Env.JWT_EXPIRES_IN)
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy],
})
export class AuthModule {}