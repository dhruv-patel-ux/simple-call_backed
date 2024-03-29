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
    
    @Post('validate-token')
    validateToken(@Body() body:any) {
        return this.authService.login(body.token);
    }

    @Get()
    getHello(): string {
        return this.authService.getHello();
    }
}
