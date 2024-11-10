import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutingModule } from './routes/routing.module';
import { AuthModule } from './auth/auth.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RoomsModule } from './rooms/rooms.module';
import { RoomChatModule } from './room-chat/room-chat.module';
const DATABASE_NAME = process.env.DATABASE_NAME || 'simple-chat'
const DATABASE_URL = process.env.DATABASE_URL || `mongodb://localhost:27017/${DATABASE_NAME}`

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL),
    UsersModule,
    AuthModule,
    RoutingModule,
    WebsocketModule,
    ServeStaticModule.forRoot({
       rootPath: join(__dirname, ".."),
        renderPath: "public/user-avatars",
    }),
    RoomsModule,
    RoomChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
