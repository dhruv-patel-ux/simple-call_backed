import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './entities/room.entity';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as mongoose from 'mongoose';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>
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
      const createRoom = new this.roomModel({ roomId, usersId: createRoomDto, lastMessage: '' });
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
  async findAll(usersId: any) {
    const userIdObject = new mongoose.Types.ObjectId(usersId);
    return await this.roomModel.aggregate([
      {
        $addFields: {
          toUserId: {
            $filter: {
              input: "$usersId",
              as: "userId",
              cond: {
                $ne: [
                  "$$userId",
                  userIdObject
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          usersId: userIdObject
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "toUserId",
          foreignField: "_id",
          as: "ToUserProfile",
        },
      },
      {
        $project: {
          "ToUserProfile.username": 1,
          "ToUserProfile.avatar": 1,
          "ToUserProfile._id": 1,
          "usersId": 1,
          "activeUsers": 1,
          "roomId": 1,
          "lastMessage": 1
        }
      }
    ])
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  updateActiveUsers(id: any, userId: any, action: any) {
    try {
      const condition = {};
      if (action === 'add') condition['$push'] = { activeUsers: userId };
      if (action == 'remove') condition['$pull'] = { activeUsers: userId };
      this.roomModel.updateOne({ roomId: id }, condition).then()
      return
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: any, lastMessage: any, toUser: any) {
    try {
      const room: any = await this.roomModel.findOne({ roomId: id });
      if (!room.activeUsers.includes(toUser)) {
        let count: any = {}
        if (room.unreadCount?.indexOf(toUser) != '-1') {
          console.log(room.unreadCount.indexOf(toUser));
        } else {
          count = {
            id: toUser,
            count: 1
          }
        }
        console.log(count);
        return this.roomModel.updateOne(
          { roomId: id },
          {
            $set:
              { lastMessage: lastMessage, $push: { unreadCount: count } }
          })
      } else {
        return this.roomModel.updateOne({ roomId: id }, { $set: { lastMessage: lastMessage } })
      }
    } catch (e) {
      console.log(e);
      return
    }
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
