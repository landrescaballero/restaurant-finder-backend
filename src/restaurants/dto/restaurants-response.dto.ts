import { ApiProperty } from '@nestjs/swagger';

export class RestaurantDto {
    @ApiProperty({ example: "Joe's Diner", description: 'Name of the restaurant' })
    name: string;

    @ApiProperty({ example: '123 Main St, New York, NY', description: 'Formatted address' })
    address: string;

    @ApiProperty({ example: 'https://maps.google.com/?q=Joe\'s+Diner', description: 'Google Maps URL' })
    mapUrl: string;

    @ApiProperty({ example: 'https://joesdiner.com', description: 'Restaurant website URL' })
    websiteUrl: string;

    @ApiProperty({
        type: [String],
        example: ['restaurant', 'food'],
        description: 'List of types associated with the restaurant',
    })
    types: string[];
}
