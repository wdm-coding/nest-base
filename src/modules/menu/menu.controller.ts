import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('add')
  async create(@Body() createMenuDto: CreateMenuDto) {
    const menu = await this.menuService.create(createMenuDto);
    return {
      data: menu,
    }
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get('tree')
  async findMenuTree() {
    const menuTree = await this.menuService.findMenuTree();
    return {
      data: menuTree,
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
