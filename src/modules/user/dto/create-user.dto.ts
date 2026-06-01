import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsEnum
} from 'class-validator';
export class CreateUserDto {
  // 用户名
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(4, { message: '用户名长度不能小于4位' })
  username: string;
  // 密码
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  password: string;
  // 手机号
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString({ message: '手机号必须是字符串' })
  @MinLength(11, { message: '手机号长度必须为11位' })
  phone: string;
  // 邮箱
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({},{ message: '邮箱格式错误' })
  email: string;
  // 昵称
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @MinLength(4, { message: '昵称长度不能小于4位' })
  nickname: string;
  // 年龄
  @IsOptional() 
  @IsNumber({},{ message: '年龄必须是数字' })
  @Min(18, { message: '年龄不能小于18岁' })
  @Max(120, { message: '年龄不能大于120岁' })
  age: number;
  // 头像
  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  avatar: string;
  // 地址
  @IsOptional()
  @IsString({ message: '地址必须是字符串' })
  address: string;
  // 状态
  @IsNumber({},{ message: '状态必须是数字' })
  @IsEnum([0, 1], { message: '状态必须是枚举值' })
  status: number;
}
