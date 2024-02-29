import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || '~~simple~chat~~'
@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService
    ) { }
    async login(data: any) {
        const user = await this.userService.findOneByMail(data.username);
        if (!user) return 'User Not Found'
        const checkPassword = bcrypt.compareSync(data.password, user.password);
        if (!checkPassword) return "Password Not Match";

        const accessToken = await this.generateToken(user._id);
        return { ...user.toObject(), accessToken }
    }
    getHello(): string {
        return 'Hello World!';
    }
    async generateToken(id: any) {
        if (!id) return '';
        const user = await this.userService.findOne(id);
        if (!id) return 'Invalid Id';
        const plainUser = user.toObject();

        return sign(plainUser, JWT_SECRET)
    }
}
