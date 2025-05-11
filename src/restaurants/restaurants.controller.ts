import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { getRestaurantsByCityDto, getRestaurantsByCoordinatesDto } from './dto/restaurants.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private readonly restaurantsService: RestaurantsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('coordinates')
    async getRestaurantsByCoordinates(
        @Query() query: getRestaurantsByCoordinatesDto,
        @User('userId') userId: number
    ) {
        return await this.restaurantsService.getRestaurantsByCoordinates(userId, query.lat, query.lng);
    }

    @UseGuards(JwtAuthGuard)
    @Get('city')
    async getRestaurantsByCity(
        @Query() query: getRestaurantsByCityDto,
        @User('userId') userId: number
    ) {
        return await this.restaurantsService.getRestaurantsByCity(userId, query.city);
    }
}
