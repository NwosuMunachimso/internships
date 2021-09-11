import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {

    try {

      const newEmployee = await this.employeeRepository.create(createEmployeeDto);

      return await this.employeeRepository.save(newEmployee)

    } catch (error) {

      if (error && error.code == PG_UNIQUE_CONSTRAINT_VIOLATION) {

        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: `There was a problem creating a new Employee ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      } else {

        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem creating a new Employee. ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

  }

  async findAll(): Promise<Employee[]> {
    try {

      return await this.employeeRepository.find()

    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new Employee. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<Employee> {
    try {

      return await this.employeeRepository.findOne(id)

    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new Employee. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<UpdateResult> {
    try {
      return await this.employeeRepository.update(id, { ...updateEmployeeDto })
    } catch (error) {

      if (error && error.code == PG_UNIQUE_CONSTRAINT_VIOLATION) {

        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: `There was a problem updating the Employee ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      } else {

        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem updating the Employee. ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }

    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.employeeRepository.delete(id)
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem removing the Employee. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }
  }

  // Relationships

  async addDepartmentById(employeeId: number, departmentId: number): Promise<void> {
    return await this.employeeRepository.createQueryBuilder()
      .relation(Employee, 'department')
      .of(employeeId)
      .add(departmentId)
  }

  // remove Departments by id

  async removeDepartmentById(employeeId: number, departmentId: number): Promise<void> {
    return await this.employeeRepository.createQueryBuilder()
      .relation(Employee, 'department')
      .of(employeeId)
      .remove(departmentId)
  }

}