// src/auth/dto/auth-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' })
    access_token: string;
}

export class SimpleResponseDto {
    @ApiProperty()
    message: string;

    @ApiProperty({ example: true })
    status: boolean;
}

export class HttpExceptionDto {
    @ApiProperty({ example: false })
    status: boolean;

    @ApiProperty()
    message: string;
}