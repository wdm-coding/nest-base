import { Injectable, HttpException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {  PaginationResult } from '@/types';
import {UserPaginationParams} from './types';
import { buildQueryParams, SearchConfigType } from '@/common/utils/query.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '@/common/utils/bcrypt.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  // 分页查询用户列表
  async findAll(params: UserPaginationParams): Promise<PaginationResult<User>> {
    const { page = 1, limit = 10, username, email, phone } = params;
    const skip = (page - 1) * limit;
    const searchConfigs: SearchConfigType[] = [
      { field: 'username', param: 'username', type: 'like' },
      { field: 'email', param: 'email', type: 'like' },
      { field: 'phone', param: 'phone', type: 'like' },
    ];
    const queryParams = {
      username,
      email,
      phone,
    };
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    buildQueryParams(queryBuilder, queryParams, searchConfigs);
    queryBuilder.orderBy('user.createdAt', 'DESC').skip(skip).take(limit);
    const [list, total] = await queryBuilder.getManyAndCount();
    return {
      list,
      total,
      page:Number(page),
      limit:Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }
  // 创建用户
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { username, password, email, phone, nickname, age, avatar, address,status = 1 } = createUserDto;
    // 校验用户名是否存在
    const existingByUsername = await this.userRepository.findOne({ where: { username } });
    if (existingByUsername) {
      throw new HttpException('用户名已存在',200);
    }
    // 校验邮箱是否存在
    const existingByEmail = await this.userRepository.findOne({ where: { email } });
    if (existingByEmail) {
      throw new HttpException('邮箱已被注册',200);
    }
    // 校验手机号是否存在
    const existingByPhone = await this.userRepository.findOne({ where: { phone } });
    if (existingByPhone) {
      throw new HttpException('手机号已被注册',200);
    }
    // 加密密码
      const hashedPassword = await hashPassword(password);

    const user = await this.userRepository.save({
      username,
      password: hashedPassword,
      email,
      phone,
      nickname,   
      age,
      avatar,
      address,
      status
    });

    const { password: _, ...result } = user;
    return result;
  }
}
