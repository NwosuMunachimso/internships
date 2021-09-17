import { Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Post()
  create(@Body() createUserProfileDto: CreateUserProfileDto, @Req() req: any) {
    return this.userProfilesService.create(createUserProfileDto, req);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.userProfilesService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.userProfilesService.findOne(+id, req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserProfileDto: UpdateUserProfileDto, @Req() req: any) {
    return this.userProfilesService.update(+id, updateUserProfileDto,req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.userProfilesService.remove(+id,req);
  }
}
