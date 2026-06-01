import { Controller, UseGuards, Get, Query, Post, Body, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import type { PaginationParams } from '@/types';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) { 
    this.logger.log('logger-用户控制器初始化');
  }
  // 获取用户列表
  @Get('list')
  async findAll(@Query() params: PaginationParams) {
    const userList = await this.userService.findAll(params);
    return {
      data: userList,
    }
  }
  // 创建用户
  @Post('add')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      data: user
    }
  }
}