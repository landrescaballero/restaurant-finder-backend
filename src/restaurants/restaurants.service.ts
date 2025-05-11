import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { EnvironmentConfig } from 'src/config/config';
import { Restaurant } from './dto/restaurants.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionMethod } from 'src/transactions/dto/transactions.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly transactionsService: TransactionsService,
    ) { }

    /**
     * Parses raw restaurant data into an array of Restaurant objects.
     * @param data - An array of raw data to be parsed.
     * @returns An array of Restaurant objects.
     */
    private parseRestaurantData(data: any[]): Restaurant[] {
        return data.map((item) => {
            return {
                name: item.displayName.text,
                address: item.formattedAddress,
                mapUrl: item.googleMapsUri,
                websiteUrl: item.websiteUri,
                types: item.types,
            }
        });
    }

    /**
     * Fetches restaurants near a specific set of coordinates.
     * @param userId - The ID of the user requesting the restaurants.
     * @param lat - Latitude of the location.
     * @param lng - Longitude of the location.
     * @param city - Optional city name for categorizing the transaction.
     * @returns A promise that resolves with an array of Restaurant objects.
     * @throws BadRequestException if the user is not found.
     * @throws Error if the API request fails.
     */
    async getRestaurantsByCoordinates(userId: number, lat: string, lng: string, city: string = ''): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const url = EnvironmentConfig.mapUrlCoordinates;
        const body = {
            includedTypes: [
                "restaurant"
            ],
            locationRestriction: {
                circle: {
                    center: {
                        latitude: lat,
                        longitude: lng
                    },
                    radius: 1500.0
                }
            }
        }

        const headers = {
            "X-Goog-Api-Key": EnvironmentConfig.mapApiKey,
            "X-Goog-FieldMask": EnvironmentConfig.mapFieldMask,
        }

        const response = await axios.post(url, body, {
            headers: headers,
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            console.error('Error fetching restaurants:', error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error details:', error.response.data);
            }
            throw new Error('Error fetching restaurants');
        });

        const result = this.parseRestaurantData(response.places);


        await this.transactionsService.createTransaction({
            user,
            method: city ? TransactionMethod.CITY : TransactionMethod.COORDINATES,
            query: city ? city : `${lat}, ${lng}`,
            result,
        });

        return result;
    }


    /**
     * Fetches restaurants in a specific city.
     * @param userId - The ID of the user requesting the restaurants.
     * @param city - The city to search for restaurants.
     * @returns A promise that resolves with an array of Restaurant objects.
     * @throws BadRequestException if no results are found for the city.
     * @throws Error if the API request fails.
     */
    async getRestaurantsByCity(userId: number, city: string): Promise<Restaurant[]> {
        const url = EnvironmentConfig.mapUrlCity;

        const params = {
            address: city,
            key: EnvironmentConfig.mapApiKey,
        }
        const response = await axios.get(url, {
            params: params,
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            console.error('Error fetching restaurants:', error);
            throw new Error('Error fetching restaurants');
        });
        if (response.status === 'OK') {
            if (response.results.length === 0) {
                throw new BadRequestException('No results found for the given city');
            }
            const location = response.results[0].geometry.location;
            return await this.getRestaurantsByCoordinates(userId, location.lat, location.lng, city);
        } else {
            throw new Error(`Error fetching restaurants: ${response.status}`);
        }

    }
}
