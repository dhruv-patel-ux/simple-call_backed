import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { RoomChatModule } from 'src/room-chat/room-chat.module';
import { RoomsModule } from 'src/rooms/rooms.module';
@Module({
    imports: [
        RoomChatModule,
        RoomsModule
    ],
    providers: [WebsocketGateway]
})
export class WebsocketModule { }