import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from '@/modules/role/entities/role.entity';
@Entity({ name: 'user_role' })
// 联合唯一索引：防止给同一个用户重复分配同一个角色
@Unique(['userId', 'roleId'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid',{ comment: '主键ID' })
  id: string;

  @Column({ type: 'uuid', comment: '用户ID' })
  @Index()
  userId: string;

  @Column({ type: 'uuid', comment: '角色ID' })
  @Index()
  roleId: string;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createdAt: Date;
  
  // 关联用户
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // 关联角色
  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
