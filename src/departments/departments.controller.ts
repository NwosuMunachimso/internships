import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto, @Req() req: any) {
    return this.departmentsService.create(createDepartmentDto, req);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.departmentsService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.departmentsService.findOne(+id,req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto,@Req() req: any) {
    return this.departmentsService.update(+id, updateDepartmentDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.departmentsService.remove(+id,req);
  }
}
