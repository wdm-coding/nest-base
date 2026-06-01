import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])],// 在这里注册你的实体，TypeORM 会自动生成 Repository
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
