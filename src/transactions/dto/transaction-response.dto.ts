import { ApiProperty } from '@nestjs/swagger';
import { TransactionMethod } from '../dto/transactions.dto';

export class Restaurant {
    @ApiProperty({
        description: 'The name of the restaurant',
        example: 'Restaurant 1',
    })
    name: string;

    @ApiProperty({
        description: 'The address of the restaurant',
        example: '123 Main St',
    })
    address: string;

    @ApiProperty({
        description: 'The URL to view the restaurant on Google Maps',
        example: 'https://maps.google.com/?q=Restaurant+1',
    })
    mapUrl: string;

    @ApiProperty({
        description: 'The URL of the restaurant\'s website',
        example: 'http://restaurant1.com',
    })
    websiteUrl: string;

    @ApiProperty({
        description: 'The types of the restaurant (e.g., Italian, Fast Food)',
        example: ['Italian', 'Restaurant'],
    })
    types: string[];
}

export class User {
    @ApiProperty({
        description: 'The unique identifier of the user',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'The name of the user',
        example: 'John',
    })
    firstName: string;

    @ApiProperty({
        description: 'The last name of the user',
        example: 'Doe',
    })
    lastName: string;

    @ApiProperty({
        description: 'The username of the user',
        example: 'johndoe',
    })
    username: string;

}


export class TransactionResponseDto {
    @ApiProperty({
        description: 'The unique identifier of the transaction',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'The transaction method (e.g., CITY, COORDINATES)',
        example: 'CITY',
    })
    method: TransactionMethod;

    @ApiProperty({
        description: 'The query parameter passed with the transaction (city or coordinates)',
        example: 'New York',
    })
    query: string;

    @ApiProperty({
        description: 'The result of the transaction, which can be a list of restaurants',
        type: [Restaurant],
        example: [
            {
                name: 'Restaurant 1',
                address: '123 Main St',
                mapUrl: 'https://maps.google.com/?q=Restaurant+1',
                websiteUrl: 'http://restaurant1.com',
                types: ['restaurant'],
            }
        ],
    })
    result: Restaurant[];

    @ApiProperty({
        description: 'The date when the transaction was created',
        example: '2025-05-11T12:34:56.789Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'The user who performed the transaction',
        type: User,
        example: {
            id: 1,
            name: 'John Doe',
        },
    })
    user: User;
}