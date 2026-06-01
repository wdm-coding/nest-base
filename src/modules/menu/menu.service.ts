import { Injectable, HttpException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    if (createMenuDto.code) {
      const existingMenu = await this.menuRepository.findOne({
        where: { code: createMenuDto.code },
      });
      if (existingMenu) {
        throw new HttpException('菜单编码已存在', 200);
      }
    }
    const menu = this.menuRepository.create(createMenuDto);
    return await this.menuRepository.save(menu);
  }

  async findAll() {
    return await this.menuRepository.find({
      where: { parentId: undefined },
      relations: ['children'],
      order: { sort: 'ASC' },
    });
  }

  async findOne(id: string) {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['children'],
      order: { sort: 'ASC' },
    });
    if (!menu) {
      throw new HttpException('菜单不存在', 200);
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new HttpException('菜单不存在', 200);
    }
    if (updateMenuDto.code && updateMenuDto.code !== menu.code) {
      const existingMenu = await this.menuRepository.findOne({
        where: { code: updateMenuDto.code },
      });
      if (existingMenu) {
        throw new HttpException('菜单编码已存在', 200);
      }
    }
    Object.assign(menu, updateMenuDto);
    return await this.menuRepository.save(menu);
  }

  async remove(id: string) {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new HttpException('菜单不存在', 200);
    }
    await this.menuRepository.remove(menu);
    return { message: '删除成功' };
  }

  async findMenuTree() {
    const menus = await this.menuRepository.find({
      where: { status: 1 },
      order: { sort: 'ASC' },
    });
    return this.buildTree(menus);
  }

  private buildTree(menus: Menu[], parentId: string | null = null): Menu[] {
    return menus
      .filter((menu) => menu.parentId === parentId)
      .map((menu) => ({
        ...menu,
        children: this.buildTree(menus, menu.id),
      }));
  }
}
