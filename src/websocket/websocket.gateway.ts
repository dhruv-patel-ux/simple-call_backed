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
import { UsersService } from "src/users/users.service";

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
        private roomService: RoomsService,
        private usersService: UsersService
    ) { }
    @WebSocketServer() io: Server;
    afterInit() {
        this.logger.log("Initialized");
    }

    handleConnection(client: Socket) {
        const { sockets } = this.io.sockets;
        console.log(client.id, client.handshake.query.userId);

        this.usersService.updateSoketId({ socketId: client.id, id: client.handshake.query.userId }).then()
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
    async handleMessage(client: Socket, data: any) {
        const res= await  this.roomChatService.create({
            userId: data.userId,
            roomId: data.roomId,
            message: data.message,
            replay: data.replay
        })
        this.io.to(data.roomId).emit('message', { _id: res._id, message: data.message, userId: data.userId, replay: data.replay });
        this.roomService.update(data.roomId, data.message, data.toUserId).then((res: any) => {});
        const ToUSer = await this.usersService.findOne(data.toUserId)
        const friends = await this.roomService.findAll(data.toUserId);
        console.log(ToUSer);
        
        this.io.sockets.to(ToUSer?.socketId).emit('friend-list', friends)
    }
    @SubscribeMessage('react')
    async handleReact(client: Socket, data: any) {
        this.roomChatService.addReact({
            index: data.index,
            message_id: data.message_id,
        }).then();

        this.io.to(data.roomId).emit('react', {
            index: data.index,
            message_id: data.message_id,
        });
    }
    @SubscribeMessage('joinVideoCall')
    async handleVideoCall(client: Socket, data: any) {
        const { userId, appId, channel, token } = data;
        const user = await this.usersService.findOne(userId);
        console.log("Socket Id ------", user.socketId);

        this.io.sockets.to(user.socketId).emit('getVideoCall', { appId, channel, token });
    }

    @SubscribeMessage('friend-list')
    async getFriendList(client: Socket, userId: any) {
        const friends = await this.roomService.findAll(userId)
        client.emit('friend-list', friends)
    }
}