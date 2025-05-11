import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({ example: true })
    status: boolean;

    @ApiProperty({ example: 'User registered successfully' })
    message: string;

    @ApiProperty({
        example: {
            id: 1,
            username: 'johndoe',
            firstName: 'John',
            lastName: 'Doe',
        },
    })
    data: {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
    };
}

