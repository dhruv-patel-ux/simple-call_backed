import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomChatService } from './room-chat.service';
import { CreateRoomChatDto } from './dto/create-room-chat.dto';
import { UpdateRoomChatDto } from './dto/update-room-chat.dto';
import { AuthGuard } from 'src/common-services/guard.service';

@Controller('')
export class RoomChatController {
  constructor(private readonly roomChatService: RoomChatService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createRoomChatDto: CreateRoomChatDto) {
    return this.roomChatService.create(createRoomChatDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.roomChatService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: any) {
    return this.roomChatService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateRoomChatDto: UpdateRoomChatDto) {
    return this.roomChatService.update(+id, updateRoomChatDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.roomChatService.remove(+id);
  }
}
