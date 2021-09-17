import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { logger } from '../main';
@Injectable()
export class DepartmentsService {

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) { }

  async create(createDepartmentDto: CreateDepartmentDto, req:any): Promise<Department> {

    try {

      const newDept = await this.departmentRepository.create(createDepartmentDto);

      return await this.departmentRepository.save(newDept)

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
          error: `There was a problem creating a new department ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      } else {

        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem creating a new department. ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

  }

  async findAll(req:any): Promise<Department[]> {
    try {

      return await this.departmentRepository.find()

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
        error: `There was a problem creating a new department. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number, req:any): Promise<Department> {
    try {

      return await this.departmentRepository.findOne(id)

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
        error: `There was a problem creating a new department. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto, req: any): Promise<UpdateResult> {
    try {
      return await this.departmentRepository.update(id, { ...updateDepartmentDto })
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
          error: `There was a problem updating the department ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      } else {

        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem updating the department. ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }

    }
  }

  async remove(id: number, req:any): Promise<DeleteResult> {
    try {
      return await this.departmentRepository.delete(id)
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
          error: `There was a problem removing the department. ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      

    }
  }
  
}