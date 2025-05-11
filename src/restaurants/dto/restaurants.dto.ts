import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from "class-validator";

export class getRestaurantsByCoordinatesDto {
    @IsNotEmpty()
    @IsString()
    @IsLatitude()
    lat: string;

    @IsNotEmpty()
    @IsString()
    @IsLongitude()
    lng: string;
}

export class getRestaurantsByCityDto {
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