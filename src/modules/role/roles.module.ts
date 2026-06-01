import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { RoleMenu } from './entities/role-menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleMenu])],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}
