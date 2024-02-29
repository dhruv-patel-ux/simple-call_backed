import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        RouterModule.register([
            {
                path: 'users',
                module: UsersModule,
            },
            {
                path: 'auth',
                module: AuthModule,
            },
        ]),
    ],
})
export class RoutingModule { }
