import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>
  ) { }

  async create(createUserProfileDto: CreateUserProfileDto): Promise<UserProfile> {

    try {

      const newUserProfile = await this.userProfileRepository.create(createUserProfileDto);

      return await this.userProfileRepository.save(newUserProfile)

    } catch (error) {

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

  async findAll(): Promise<UserProfile[]> {
    try {

      return await this.userProfileRepository.find()

    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new UserProfile. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<UserProfile> {
    try {

      return await this.userProfileRepository.findOne(id)

    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem creating a new UserProfile. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateUserProfileDto: UpdateUserProfileDto): Promise<UpdateResult> {
    try {
      return await this.userProfileRepository.update(id, { ...updateUserProfileDto })
    } catch (error) {

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

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.userProfileRepository.delete(id)
    } catch (error) {

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem removing the UserProfile. ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)


    }
  }
}