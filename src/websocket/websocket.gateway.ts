import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { RoomChatService } from "src/room-chat/room-chat.service";
import { RoomsService } from "src/rooms/rooms.service";

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:4200'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
})
export class WebsocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(WebsocketGateway.name);
    constructor(
        private roomChatService: RoomChatService,
        private roomService: RoomsService
    ) { }
    @WebSocketServer() io: Server;
    afterInit() {
        this.logger.log("Initialized");
    }

    handleConnection(client: Socket) {
        const { sockets } = this.io.sockets;

        this.logger.debug(`Client id: ${client.id} connected`);
        this.logger.debug(`Number of connected clients: ${sockets.size}`);

    }

    handleDisconnect(client: any) {
        this.logger.log(`Cliend id:${client.id} disconnected`);
    }

    @SubscribeMessage('joinRoom')
    joinRoom(client: Socket, { roomId, userId }) {
        if (!roomId || !userId) {
            throw new HttpException('User and Room Id not found', HttpStatus.BAD_REQUEST)
        }
        this.roomService.updateActiveUsers(roomId, userId, 'add');
        client.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
    }
    @SubscribeMessage('leaveRoom')
    async leaveRoom(client: Socket, { roomId, userId }) {
        this.roomService.updateActiveUsers(roomId, userId, 'remove');
        client.leave(roomId);
        const friends = await this.roomService.findAll(userId)
        client.emit('friend-list', friends)
        console.log(`User ${userId} left room ${roomId}`);

    }
    @SubscribeMessage('message')
    handleMessage(client: Socket, data: any) {
        this.roomChatService.create({
            userId: data.userId,
            roomId: data.roomId,
            message: data.message,
        }).then();
        this.roomService.update(data.roomId, data.message, data.toUserId).then((res:any)=>{
            console.log(res);
            
        });
        this.io.to(data.roomId).emit('message', { message: data.message, userId: data.userId });
    }

    @SubscribeMessage('friend-list')
    async getFriendList(client: Socket, userId: any) {
        const friends = await this.roomService.findAll(userId)
        client.emit('friend-list', friends)
    }
}