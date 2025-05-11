import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/users.dto';
import { JwtAuthGuard } from './jwt.guard';
import { AuthToken } from 'src/common/decorators/token.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.username, body.password);
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('validate-session')
    async ok() {
        return this.authService.ok();
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@AuthToken() token: string) {
        return this.authService.logout(token);
    }

}
