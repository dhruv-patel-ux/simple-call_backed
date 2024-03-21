import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomChatService } from './room-chat.service';
import { CreateRoomChatDto } from './dto/create-room-chat.dto';
import { UpdateRoomChatDto } from './dto/update-room-chat.dto';

@Controller('')
export class RoomChatController {
  constructor(private readonly roomChatService: RoomChatService) {}

  @Post()
  create(@Body() createRoomChatDto: CreateRoomChatDto) {
    return this.roomChatService.create(createRoomChatDto);
  }

  @Get()
  findAll() {
    return this.roomChatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.roomChatService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomChatDto: UpdateRoomChatDto) {
    return this.roomChatService.update(+id, updateRoomChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomChatService.remove(+id);
  }
}
