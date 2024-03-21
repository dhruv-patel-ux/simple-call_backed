import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { RoomChatModule } from 'src/room-chat/room-chat.module';
@Module({
    imports: [
        RoomChatModule
    ],
    providers: [WebsocketGateway]
})
export class WebsocketModule { }