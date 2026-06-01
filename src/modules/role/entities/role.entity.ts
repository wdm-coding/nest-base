import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn('uuid',{ comment: '主键ID' })
  id: string;

  @Column({ type: 'varchar', length: 50, comment: '角色名称', unique: true })
  name: string; // 例如：Admin, User

  @Column({ type: 'varchar', length: 50, comment: '角色编码', unique: true })
  code: string; // 例如：admin, user, guest

  @Column({ type: 'varchar', length: 100, comment: '角色描述', nullable: true })
  description?: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态' })
  status: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createdAt: Date;
}