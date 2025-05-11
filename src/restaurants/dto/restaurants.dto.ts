import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class getRestaurantsByCoordinatesDto {
    @ApiProperty({ example: '40.730610', description: 'Latitude of the location' })
    @IsNotEmpty()
    @IsString()
    @IsLatitude()
    lat: string;

    @ApiProperty({ example: '-73.935242', description: 'Longitude of the location' })
    @IsNotEmpty()
    @IsString()
    @IsLongitude()
    lng: string;
}

export class getRestaurantsByCityDto {
    @ApiProperty({ example: 'New York', description: 'Name of the city to search restaurants in' })
    @IsNotEmpty()
    @IsString()
    city: string;
}


export interface Restaurant {
    name: string;
    address: string;
    mapUrl: string;
    websiteUrl: string;
    types: string[];
}