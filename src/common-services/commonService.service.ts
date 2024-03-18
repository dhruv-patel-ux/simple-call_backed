import { Injectable } from "@nestjs/common";
import { sign } from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || '~~simple~chat~~'

@Injectable()
export class CommonService {
    async generateToken(user: any) {
        if(!user) return ''
        const plainUser = user.toObject();
        delete plainUser.password
        return sign(plainUser, JWT_SECRET)
    }
}