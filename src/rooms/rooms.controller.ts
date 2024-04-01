import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthGuard } from 'src/common-services/guard.service';

@Controller('')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createRoomDto: CreateRoomDto) {
    if(createRoomDto?.length < 2 ){
      return {
        statusCode:400,
        status:false,
        message:"Please Provide 2 users Id"
      }
    }
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query:any) { 
    return this.roomsService.findAll(query.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
