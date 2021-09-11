import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {

  constructor(@InjectRepository(Role)
  private readonly roleRepository: Repository<Role>
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {

      const newRole = await this.roleRepository.create(createRoleDto)

      return await this.roleRepository.save(newRole)

    } catch (error) {
      if (error && error.code == PG_UNIQUE_CONSTRAINT_VIOLATION) {

        throw new HttpException({
          status: HttpStatus.BAD_REQUEST, //??
          error: `There was a problem creating a new role ${error.message}`
        }, HttpStatus.BAD_REQUEST)

      } else {

        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem creating a new role ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)

      }
    }
  }

  async findAll(): Promise<Role[]> {
    try {

      return await this.roleRepository.find()

    } catch (error) {

      // no possibility of constraint since we are not writing to db

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new role ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async findOne(id: number): Promise<Role> {
    try {

      return await this.roleRepository.findOne(id)

    } catch (error) {

      // no possibility of constraint since we are not writing to db

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new role ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<UpdateResult> {

    try {

      return await this.roleRepository.update(id, { ...updateRoleDto }) //??

    } catch (error) {

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

  async remove(id: number): Promise<DeleteResult> {
    try {

      return await this.roleRepository.delete(id)

    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem removing the role ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }
}