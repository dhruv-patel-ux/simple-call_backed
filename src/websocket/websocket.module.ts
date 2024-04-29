import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { RoomChatModule } from 'src/room-chat/room-chat.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersModule } from 'src/users/users.module';
@Module({
    imports: [
        RoomChatModule,
        RoomsModule,
        UsersModule
    ],
    providers: [WebsocketGateway]
})
export class WebsocketModule { }