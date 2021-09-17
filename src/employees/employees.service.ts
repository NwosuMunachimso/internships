import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { logger } from '../main';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto, req:any): Promise<Employee> {

    try {

      const newEmployee = await this.employeeRepository.create(createEmployeeDto);

      return await this.employeeRepository.save(newEmployee)

    } catch (error) {

      logger.error(error.message, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });
      logger.debug(error.stack, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });
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

  async findAll(req:any): Promise<[Employee[], number]> {
    try {

      return await this.employeeRepository.findAndCount()

    } catch (error) {
      logger.error(error.message, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });
      logger.debug(error.stack, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new Employee. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAllWithOptions(findOptions:string, req:any): Promise<[Employee[], number]>{
    try{
      return await this.employeeRepository.findAndCount(JSON.parse(findOptions));
    }catch (error){
      logger.error(error.message, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });
      logger.debug(error.stack, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem assessing employee data:${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async findOne(id: number, req:any): Promise<Employee> {
    try {

      return await this.employeeRepository.findOne(id)

    } catch (error) {
      logger.error(error.message, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });
      logger.debug(error.stack, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new Employee. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto, req:any): Promise<UpdateResult> {
    try {
      return await this.employeeRepository.update(id, { ...updateEmployeeDto })
    } catch (error) {
      logger.error(error.message, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });
      logger.debug(error.stack, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });

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

  async remove(id: number,req:any): Promise<DeleteResult> {
    try {
      return await this.employeeRepository.delete(id)
    } catch (error) {
      logger.error(error.message, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });
      logger.debug(error.stack, {
        time: new Date(),
        request_method: req.method,
        endnpoint: req.url,
        client: req.socket.remoteAddress,
        agent: req.headers['user-agent'],
      });

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem removing the Employee. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }
  }

  // Relationships

  async addDepartmentById(employeeId: number, departmentId: number, req:any): Promise<void> {
    try {
      return await this.employeeRepository.createQueryBuilder()
        .relation(Employee, 'department')
        .of(employeeId)
        .add(departmentId)
  } catch (error) {
    logger.error(error.message, {
      time: new Date(),
      request_method: req.method,
      endnpoint: req.url,
      client: req.socket.remoteAddress,
      agent: req.headers['user-agent'],
    });
    logger.debug(error.stack, {
      time: new Date(),
      request_method: req.method,
      endnpoint: req.url,
      client: req.socket.remoteAddress,
      agent: req.headers['user-agent'],
    });
  }
}

  // remove Departments by id

  async removeDepartmentById(employeeId: number, departmentId: number, req:any): Promise<void> {
    try{
      return await this.employeeRepository.createQueryBuilder()
        .relation(Employee, 'department')
        .of(employeeId)
        .remove(departmentId)
  }catch (error) {
    logger.error(error.message, {
      time: new Date(),
      request_method: req.method,
      endnpoint: req.url,
      client: req.socket.remoteAddress,
      agent: req.headers['user-agent'],
    });
    logger.debug(error.stack, {
      time: new Date(),
      request_method: req.method,
      endnpoint: req.url,
      client: req.socket.remoteAddress,
      agent: req.headers['user-agent'],
    });
  }
}

}