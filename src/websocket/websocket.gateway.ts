import { Logger } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { verify } from 'jsonwebtoken'
import { RoomChatService } from "src/room-chat/room-chat.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RoomChat } from "src/room-chat/entities/room-chat.entity";
const JWT_SECRET = process.env.JWT_SECRET || '~~simple~chat~~'

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
    private liveUsers = []
    constructor(
        private roomChatService: RoomChatService
    ) { }
    @WebSocketServer() io: Server;
    afterInit() {
        this.logger.log("Initialized");
    }

    handleConnection(client: Socket) {
        const { sockets } = this.io.sockets;
        // this.logger.log(client.handshake.query)
        // const token = verify(client.handshake.query.authorization, JWT_SECRET);
        // if (!token) return ''
        // this.logger.debug(token);
        // this.liveUsers.push({ user_id: token._id,SocketId: client.id })
        // this.io.emit('live-users',{ users:this.liveUsers })
        // return {
        //     event: "live-users",
        //     data: { users:this.liveUsers, id: client.id },
        // }
        client.on('leaveRoom', (roomId) => {
            client.leave(roomId);
            console.log(`User ${client.id} left room ${roomId}`);
        });
        this.logger.debug(`Client id: ${client.id} connected`);
        this.logger.debug(`Number of connected clients: ${sockets.size}`);

    }

    handleDisconnect(client: any) {
        this.logger.log(`Cliend id:${client.id} disconnected`);
    }

    // @SubscribeMessage("ping")
    // handleMessage(client: any, data: any) {
    //     this.logger.log(`Message received from client id: ${client.id}`);
    //     this.logger.debug(`Payload: ${data}`);
    //     return {
    //         event: "pong",
    //         data: { data, id: client.id },
    //     };
    // }
    @SubscribeMessage('joinRoom')
    joinRoom(client: Socket, roomId: any) {
        client.join(roomId);
        console.log(`User joined room ${roomId}`);
    }

    @SubscribeMessage('message')
    async handleMessage(client: Socket, data: any) {
        const message = await this.roomChatService.create({
            userId: data.userId,
            roomId: data.roomId,
            message: data.message
        });
        this.io.to(data.roomId).emit('message', { message: data.message, userId: data.userId });
    }

}