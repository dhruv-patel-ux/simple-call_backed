import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common-services/guard.service';

@ApiTags('Users')
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('sign-up')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('update-profile-photo')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profile-photo'))
  uodateProfile(@UploadedFile() file: any, @Req() request: any) {
    return this.usersService.updateProfile({ file, user: request.user });
  }
  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() query: any,@Request() request:any) {
    console.log(request.user);
    
    return await this.usersService.findAll(request.user._id,query.SearchTerm);
  }

  @Get('find-user-profile/:id')
  @UseGuards(AuthGuard)
  findUserProfile(@Param('id') id: string) {
    return this.usersService.findUserProfile(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
