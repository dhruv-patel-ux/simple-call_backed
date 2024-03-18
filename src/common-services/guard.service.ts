import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || '~~simple~chat~~'

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token = request.headers['authorization'];
            if (!token) return false;
            const cleanToken = token.replace('Bearer', '').trim();
            const verifyToken = verify(cleanToken, JWT_SECRET);
            if (!verifyToken) return false
            request.user = verifyToken;
            return true
        } catch (e) {
            return false
        }
    }
}