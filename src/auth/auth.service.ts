import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { CommonService } from 'src/common-services/commonService.service';
const JWT_SECRET = process.env.JWT_SECRET || '~~simple~chat~~'
@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private commonService: CommonService
    ) { }
    async login(data: any) {
        const user = await this.userService.findOneByMail(data.username);
        if (!user) return {
            success: false,
            statusCode: 404,
            message: "User Not Found",
            data: []
        }
        const checkPassword = bcrypt.compareSync(data.password, user.password);
        if (!checkPassword) return {
            success: false,
            statusCode: 422,
            message: "Password Not Match",
            data: [],
        }

        const accessToken = await this.commonService.generateToken(user);
        return {
            success: true,
            statusCode: 200,
            message: "Login Successfull",
            data: user.toObject(),
            accessToken
        }
    }
    getHello(): string {
        return 'Hello World!';
    }

}
