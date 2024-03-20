import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        RouterModule.register([
            {
                path: 'users',
                module: UsersModule,
            },
            {
                path:'rooms',
                module:RoomsModule
            },
            {
                path: 'auth',
                module: AuthModule,
            },
        ]),
    ],
})
export class RoutingModule { }
