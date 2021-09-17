import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './entities/user-profile.entity';
import { logger } from '../main';
@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>
  ) { }

  async create(createUserProfileDto: CreateUserProfileDto, req:any): Promise<UserProfile> {

    try {

      const newUserProfile = await this.userProfileRepository.create(createUserProfileDto);

      return await this.userProfileRepository.save(newUserProfile)

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
          error: `There was a problem creating a new UserProfile ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      } else {

        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem creating a new UserProfile. ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

  }

  async findAll(req:any): Promise<UserProfile[]> {
    try {

      return await this.userProfileRepository.find()

    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new UserProfile. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number, req:any): Promise<UserProfile> {
    try {

      return await this.userProfileRepository.findOne(id)

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
        error: `There was a problem creating a new UserProfile. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateUserProfileDto: UpdateUserProfileDto, req:any): Promise<UpdateResult> {
    try {
      return await this.userProfileRepository.update(id, { ...updateUserProfileDto })
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
          error: `There was a problem updating the UserProfile ${error.message}`
        }, HttpStatus.BAD_REQUEST)
      } else {

        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem updating the UserProfile. ${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }

    }
  }

  async remove(id: number,req:any): Promise<DeleteResult> {
    try {
      return await this.userProfileRepository.delete(id)
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
        error: `There was a problem removing the UserProfile. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }
  }
}