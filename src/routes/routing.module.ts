import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        RouterModule.register([
            {
                path: 'users',
                module: UsersModule,
            },
        ]),
    ],
})
export class RoutingModule { }
