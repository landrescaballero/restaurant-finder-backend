import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ example: 'johndoe' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: 'Password123!',
        description:
            '8-16 characters, at least one uppercase, one lowercase, one number, and one special character',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, {
        message:
            'Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: 'johndoe' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: 'Password123!' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
