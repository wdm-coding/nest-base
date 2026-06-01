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
import { Role } from './role.entity';
import { Menu } from '@/modules/menu/entities/menu.entity';

@Entity({ name: 'role_menu' })
@Unique(['roleId', 'menuId'])
export class RoleMenu {
  @PrimaryGeneratedColumn('uuid', { comment: '主键ID' })
  id: string;

  @Column({ type: 'uuid', comment: '角色ID' })
  @Index()
  roleId: string;

  @Column({ type: 'uuid', comment: '菜单ID' })
  @Index()
  menuId: string;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createdAt: Date;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Menu, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu: Menu;
}