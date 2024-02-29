import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutingModule } from './routes/routing.module';
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://dhruvp8115:NyHoiS0dk3a2sw78@cluster0.jm7jjs0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL),
    UsersModule,
    RoutingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
