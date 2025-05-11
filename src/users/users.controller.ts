import { Body, Controller, Post, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return this.userService.registerUser(body);
    }

}
