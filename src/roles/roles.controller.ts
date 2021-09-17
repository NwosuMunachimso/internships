import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @Req() req: any) {
    return this.rolesService.create(createRoleDto, req);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.rolesService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.rolesService.findOne(+id,req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto,@Req() req: any) {
    return this.rolesService.update(+id, updateRoleDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.rolesService.remove(+id,req);
  }
}
