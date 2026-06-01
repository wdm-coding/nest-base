import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'menu' })
export class Menu {
  @PrimaryGeneratedColumn('uuid', { comment: '主键ID' })
  id: string;

  @Column({ type: 'varchar', length: 50, comment: '菜单名称' })
  name: string;

  @Column({ type: 'varchar', length: 100, comment: '菜单路径' })
  path?: string;

  @Column({ type: 'varchar', length: 100, comment: '组件路径', nullable: true })
  component?: string;

  @Column({ type: 'varchar', length: 50, comment: '菜单图标', nullable: true })
  icon?: string;

  @Column({ type: 'varchar', length: 50, comment: '菜单编码', unique: true, nullable: true })
  code?: string;

  @Column({ type: 'uuid', comment: '父菜单ID', nullable: true })
  parentId?: string;

  @Column({ type: 'int', default: 0, comment: '排序号' })
  sort: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态(0:禁用,1:启用)' })
  status: number;

  @Column({ type: 'tinyint', default: 0, comment: '是否是菜单(0:按钮,1:菜单)' })
  isMenu: number;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  updatedAt: Date;
  // 自关联父菜单
  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: Menu;
  // 自关联子菜单
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];
}