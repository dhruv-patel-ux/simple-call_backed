import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './entities/room.entity';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) { }
  async create(createRoomDto: CreateRoomDto) {
    try {
      const RoomExisted = await this.getRoomByUsersId(createRoomDto);
      if (RoomExisted.length) return {
        statusCode: 201,
        status: true,
        data: RoomExisted[0]
      }
      const roomId = uuidv4()
      const createRoom = new this.roomModel({ roomId, usersId: createRoomDto });
      const room = await createRoom.save();
      if (!room) {
        return {
          statusCode: 400,
          status: false,
          message: 'Bad Request!, Fail To Create Rooms!'
        }
      }
      return {
        statusCode: 201,
        status: true,
        data: room
      };

    } catch (e) {
      return {
        statusCode: 500,
        status: false,
        message: e.message
      }
    }
  }

  async getRoomByUsersId(usersId: any) {
    return await this.roomModel.find({ usersId: { $all: [usersId[0], usersId[1]] } }).exec();
  }
  findAll() {
    return `This action returns all rooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
