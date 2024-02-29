import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() body:LoginDto) {
        return this.authService.login(body);
    }
    
    @Get()
    getHello(): string {
        return this.authService.getHello();
    }
}
