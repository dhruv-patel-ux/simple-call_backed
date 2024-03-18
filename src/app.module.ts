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
const DATABASE_NAME = process.env.DATABASE_NAME || 'simple-chat'
const DATABASE_URL = process.env.DATABASE_URL || `mongodb+srv://dhruvp8115:NyHoiS0dk3a2sw78@cluster0.jm7jjs0.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0/simple-chat`

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
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
