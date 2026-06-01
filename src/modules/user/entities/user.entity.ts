import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn, 
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid',{ comment: '主键ID' })
  id: string;

  @Column({ type: 'varchar', length: 50, comment: '用户名', unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, comment: '密码', select: false })
  password: string;

  @Column({ type: 'varchar', length: 20, comment: '手机号', unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, comment: '邮箱', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, comment: '昵称', nullable: true })
  nickname?: string;

  @Column({ type: 'int', comment: '年龄', nullable: true })
  age?: number;

  @Column({ type: 'varchar', length: 255, comment: '头像URL', nullable: true })
  avatar?: string;

  @Column({ type: 'varchar', length: 255, comment: '地址', nullable: true })
  address?: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：0-禁用，1-启用' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createdAt: Date;

  @Column({ type: 'int', default: 0, comment: 'token版本号' })
  tokenVersion: number;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', comment: '删除时间', nullable: true })
  deletedAt: Date;
}