import { Body, Controller, Post, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { HttpExceptionDto } from 'src/auth/dto/auth-response.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({
        type: CreateUserDto,
        description: 'User registration details',
        examples: {
            example1: {
                value: {
                    firstName: 'John',
                    lastName: 'Doe',
                    username: 'johndoe',
                    password: 'Password123!',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully registered user',
        type: UserResponseDto,
    })
    @ApiResponse({
        status: 409,
        type: HttpExceptionDto,
        description: 'Username already exists',
    })
    @ApiResponse({
        status: 500,
        type: HttpExceptionDto,
        description: 'Unexpected error during user registration',
    })
    async register(@Body() body: CreateUserDto) {
        return this.userService.registerUser(body);
    }

}
