import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { logger } from '../main';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req: any): Promise<User>  {
    return this.usersService.create(createUserDto, req);
  }

  @Get()
  findAll(@Query() query:string, req: any):Promise<[User[], number]> {
    for (const queryKey of Object.keys(query)){
      if (queryKey=="find-options"){
        return this.usersService.findAllWithOptions(decodeURI(query[queryKey]), req);
      }
  }
  return this.usersService.findAll(req)
}

  @Get(':id')
  findOne(@Param('id') id: string, req: any) {
    return this.usersService.findOne(+id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    req: any,
  ) {
    return this.usersService.update(+id, updateUserDto, req);
  }



  @Patch(':userId/roles/:roleId')
  addRoleById(@Param('userId') userId: string, @Param('roleId') roleId:string): Promise<void> {
    return this.usersService.addRoleById(+userId, +roleId);
  }

  @Patch(':userId/roles')
  addRolesById(@Param('userId') userId: string, @Query() query:string ): Promise<void> {
    return this.usersService.addRolesById(+userId, query['roleid']);
  }

  @Delete(':id')
  remove(@Param('id') id: string, req: any) {
    return this.usersService.remove(+id, req);
  }
}
