import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { logger } from '../main';

@Injectable()
export class RolesService {

  constructor(@InjectRepository(Role)
  private readonly roleRepository: Repository<Role>
  ) { }

  async create(createRoleDto: CreateRoleDto,req: any): Promise<Role> { 
    try {

      const newRole = await this.roleRepository.create(createRoleDto)

      return await this.roleRepository.save(newRole)

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
          status: HttpStatus.BAD_REQUEST, //??
          error: `There was a problem creating a new role ${error.message}`
        }, HttpStatus.BAD_REQUEST)

      } else {

        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,//handled @ front end
          error: `There was a problem creating a new role ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)

      }
    }
  }

  async findAll(req:any): Promise<Role[]> {
    try {

      return await this.roleRepository.find()

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

      // no possibility of constraint since we are not writing to db

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem with acessing roles data ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async findOne(id: number, req:any): Promise<Role> {
    try {

      return await this.roleRepository.findOne(id)

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

      // no possibility of constraint since we are not writing to db

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new role ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto, req:any): Promise<UpdateResult> {

    try {

      return await this.roleRepository.update(id, { ...updateRoleDto }) //??

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
          error: `There was a problem updating the role ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      } else {

        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem creating a new role ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)

      }
    }

  }

  async remove(id: number,req:any): Promise<DeleteResult> {
    try {

      return await this.roleRepository.delete(id)

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
        error: `There was a problem removing the role ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }
}