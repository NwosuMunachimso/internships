import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { number } from 'yargs';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>

  ) { }

  async create(createUserDto: CreateUserDto): Promise<User>{
   try{
     const newUser = this.userRepository.create(createUserDto);
     //hash the password in the dto sent before we now save it
     await bcrypt.hash(newUser.passwordHash, 10).then((hash: string) => {
       newUser.passwordHash = hash //the newUser password is now the hash
     })
    
     const user = await this.userRepository.save(newUser)
     return user; //so it returns to us the saved user
     

   }catch (error){ 
     //here we are testing for constraint error
     if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION){
      //if the above is the error code then do the below 
      throw new HttpException({
        status:HttpStatus.BAD_REQUEST,
        error:`There was a problem with user creation: ${error.message}`

      }, HttpStatus.BAD_REQUEST)
    }else{
     throw new HttpException ({
       status: HttpStatus.INTERNAL_SERVER_ERROR,
       error: `There was a problem with user creation: ${error.message}`
     }, HttpStatus.INTERNAL_SERVER_ERROR)}
    }
  }
//assuming user changed the password
  async update(id:number, updateUserDto: UpdateUserDto): Promise<UpdateResult>{
    try{
      if (updateUserDto.passwordHash!= ''){
        await bcrypt.hash(updateUserDto.passwordHash, 10).then((hash: string) => {
          updateUserDto.passwordHash = hash //the newUser password is now the hash
      })
    } 
    return await this.userRepository.update(id,{... updateUserDto})
  }catch (error){ 
    //here we are testing for constraint error
    if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION){
     //if the above is the error code then do the below 
     throw new HttpException({
       status:HttpStatus.BAD_REQUEST,
       error:`There was a problem with user creation: ${error.message}`

     }, HttpStatus.BAD_REQUEST)
   }else{
    throw new HttpException ({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `There was a problem with user creation: ${error.message}`
    }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
 
  async findAll(): Promise<User[]>{
    try{
      return await this.userRepository.find();
    }catch (error){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem assessing user data:${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {

      return await this.userRepository.delete(id);

    } catch (error) {

      throw new HttpException({

        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem assessing user data: ${error.message}`
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async findOne(id:number) {
    try{
      return await this.userRepository.findOne(id);
    }catch (error){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `There was a problem assessing user data:${error.message}`
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
  }

  /**Relationships**/ 
  //here we want to add roles to user
  async addRoleById(userId: number, RoleId: number): Promise<void> { // here we use add because its many. if theres only a possibility of setting one(for one-to-one) we use 'set'
    //we are not returning anything that is why it is void
    try {
      return await this.userRepository.createQueryBuilder()
        .relation(User, 'roles') // the relation you want to work with and the field in that table
        .of(userId) // which particular user -- userId in this case, the one that we passed
        .add(RoleId) // what do we want to do? -- we want to add the field RoleId
    }
    catch (error) {

    }
  }

  async removeRoleById(userId: number, RoleId: number): Promise<void> { // here we use add because its many. if theres only a possibility of setting one(for one-to-one) we use 'set'
    //we are not returning anything that is why it is void
    try {
      return await this.userRepository.createQueryBuilder()
        .relation(User, 'roles') // the relation you want to work with and the field in that table
        .of(userId) // which particular user -- userId in this case, the one that we passed
        .remove(RoleId) // what do we want to do? -- we want to add the field RoleId
    }
    catch (error) {
    }
  }
   // assigning multiple roles to one user at a go
  // you can use this for either adding one role or multiple roles bc array accepts one or more values. Using the 2 methods is redundant

  async addRolesById(userId: number, RoleIds: number[]): Promise<void> { // here we use add because its many. if theres only a possibility of setting one(for one-to-one) we use 'set'
    //we are not returning anything that is why it is void
    try {
      return await this.userRepository.createQueryBuilder()
        .relation(User, 'roles') // the relation you want to work with and the field in that table
        .of(userId) // which particular user -- userId in this case, the one that we passed
        .add(RoleIds) // what do we want to do? -- we want to add the field RoleId
    }
    catch (error) {

    }
  }

  async removeRolesById(userId: number, RoleIds: number[]): Promise<void> { // here we use add because its many. if theres only a possibility of setting one(for one-to-one) we use 'set'
    //we are not returning anything that is why it is void
    try {
      return await this.userRepository.createQueryBuilder()
        .relation(User, 'roles') // the relation you want to work with and the field in that table
        .of(userId) // which particular user -- userId in this case, the one that we passed
        .remove(RoleIds) // what do we want to do? -- we want to add the field RoleId
    }
    catch (error) {

    }
  }

  //Now we want to handle userProfile & user here the relationship is one-to-one so we are adding one thing, hence using 'set'
  async setUserProfileById(userId: number, userProfileId: number): Promise<void> {
    try {
      return await this.userRepository.createQueryBuilder()
      .relation(User, 'userProfile')
      .of(userId)
      .set(userProfileId)
    } catch (error) {

    }
  }

  async unsetUserProfileById(userId: number, userProfileId: number): Promise<void> {
    try {
      return await this.userRepository.createQueryBuilder()
      .relation(User, 'userProfile')
      .of(userId)
      .set(null)
    } catch (error) {

    }
  }

  async addDepartmentById(userId: number, departmentId: number): Promise<void> {
    return await this.userRepository.createQueryBuilder()
    .relation(User, 'department')
    .of(userId)
    .add(departmentId)
  }

  // remove Departments by id

  async removeDepartmentById(userId: number, departmentId: number): Promise<void> {
    return await this.userRepository.createQueryBuilder()
    .relation(User, 'department')
    .of(userId)
    .remove(departmentId)
  }


}
