import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty({ message: '菜单名称不能为空' })
  name: string;

  @IsNotEmpty({ message: '菜单路径不能为空' })
  path: string;

  component?: string;

  @IsOptional()
  icon?: string;

  @IsNotEmpty({ message: '菜单编码不能为空' })
  code?: string;

  @IsOptional()
  parentId?: string;

  @IsOptional()
  sort?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  isMenu?: number;
}
