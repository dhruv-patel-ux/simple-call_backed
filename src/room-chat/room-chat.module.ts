import { Module } from '@nestjs/common';
import { RoomChatService } from './room-chat.service';
import { RoomChatController } from './room-chat.controller';
import { RoomChat, RoomChatSchema } from './entities/room-chat.entity';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { Room } from 'src/rooms/entities/room.entity';

@Module({
  imports:[MongooseModule.forFeature([{ name: RoomChat.name, schema: RoomChatSchema }])],
  controllers: [RoomChatController],
  providers: [RoomChatService],
  exports:[RoomChatService]
})
export class RoomChatModule {}
