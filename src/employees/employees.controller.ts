import { Controller, Get, Post, Body, Patch, Param, Delete, Query,Req } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto,@Req() req: any) {
    return this.employeesService.create(createEmployeeDto, req);
  }

  @Get()
  findAll(@Query() query:string,@Req() req: any):Promise<[Employee[], number]> {
    for (const queryKey of Object.keys(query)){
      if (queryKey=="find-options"){
        return this.employeesService.findAllWithOptions(decodeURI(query[queryKey]), req);
      }
  }
  return this.employeesService.findAll(req)
}

  @Patch(':employeeId/departments/:departmentId')
  addDepartmentById(@Param('employeeId') employeeId: string, @Param('departmentId') departmentId:string, @Req() req: any): Promise<void> {
    return this.employeesService.addDepartmentById(+employeeId, +departmentId, req);
}

  @Get(':id')
  findOne(@Param('id') id: string,@Req() req: any) {
    return this.employeesService.findOne(+id,req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto,@Req() req: any) {
    return this.employeesService.update(+id, updateEmployeeDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.employeesService.remove(+id,req);
  }
}
