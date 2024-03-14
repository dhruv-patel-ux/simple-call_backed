import { Injectable, Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage } from '@nestjs/websockets';

@Injectable()
export class WebsocketService {
    private readonly logger = new Logger(WebsocketService.name);

    @SubscribeMessage("ping")
    handleMessage(client: any, data: any) {
        this.logger.log(`Message received from client id: ${client.id}`);
        this.logger.debug(`Payload: ${data}`);
        return {
            event: "pong",
            data,
        };
    }
}
