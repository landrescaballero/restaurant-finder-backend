// src/auth/auth.controller.ts

import {
    Body,
    Controller,
    Post,
    Get,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/users.dto';
import { JwtAuthGuard } from './jwt.guard';
import { AuthToken } from 'src/common/decorators/token.decorator';
import {
    HttpExceptionDto,
    LoginResponseDto,
    SimpleResponseDto,
} from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiBody({
        type: LoginDto,
        examples: {
            valid: {
                value: {
                    username: 'johndoe',
                    password: 'Password123!',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Successful login',
        type: LoginResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials',
        type: HttpExceptionDto,
    })
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.username, body.password);
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('validate-session')
    @ApiOperation({ summary: 'Validate active session' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Session is valid',
        type: SimpleResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
        type: HttpExceptionDto,
    })
    async ok() {
        return this.authService.ok();
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiOperation({ summary: 'Logout user' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'User logged out',
        type: SimpleResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Session invalid or expired',
        type: HttpExceptionDto,
    })
    async logout(@AuthToken() token: string) {
        return this.authService.logout(token);
    }
}
