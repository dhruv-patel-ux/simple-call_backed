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
    @WebSocketServer() io: Server;
    afterInit() {
        this.logger.log("Initialized");
    }

    handleConnection(client: Socket) {
        const { sockets } = this.io.sockets;
        this.logger.log(client.handshake.query)
        const token = verify(client.handshake.query.authorization, JWT_SECRET);
        if (!token) return ''
        this.logger.debug(token);
        this.liveUsers.push({ user_id: token._id, socket: Socket })
        this.io.emit('live-users',{ users:this.liveUsers, id: client.id })
        return {
            event: "live-users",
            data: { users:this.liveUsers, id: client.id },
        }
        // this.logger.debug(`Client id: ${client.id} connected`);
        // this.logger.debug(`Number of connected clients: ${sockets.size}`);
    }

    handleDisconnect(client: any) {
        this.logger.log(`Cliend id:${client.id} disconnected`);
    }

    @SubscribeMessage("ping")
    handleMessage(client: any, data: any) {
        this.logger.log(`Message received from client id: ${client.id}`);
        this.logger.debug(`Payload: ${data}`);
        return {
            event: "pong",
            data: { data, id: client.id },
        };
    }
    
}