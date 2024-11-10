import { Injectable } from '@nestjs/common';
import { CreateRoomChatDto } from './dto/create-room-chat.dto';
import { UpdateRoomChatDto } from './dto/update-room-chat.dto';
import { RoomChat } from './entities/room-chat.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class RoomChatService {
  constructor(
    @InjectModel(RoomChat.name) private roomModel: Model<RoomChat>,
  ) { }
  create(createRoomChatDto: CreateRoomChatDto) {
    try {
      console.log(createRoomChatDto);
      
      return this.roomModel.create({ ...createRoomChatDto })
    } catch (e) {
      console.log(e);
      return

    }
  }

  findAll() {
    return `This action returns all roomChat`;
  }

  async findOne(id: any) {
    console.log(id);

    const RoomChat = await this.roomModel.find({ roomId: id })
    return RoomChat;
  }

  async addReact(data: any) {
    const RoomChat = await this.roomModel.updateOne({ _id: data.message_id }, { reaction: data.index });
    return RoomChat;
  }

  update(id: number, updateRoomChatDto: UpdateRoomChatDto) {
    return `This action updates a #${id} roomChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomChat`;
  }
}
