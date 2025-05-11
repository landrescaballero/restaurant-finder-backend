import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { getRestaurantsByCityDto, getRestaurantsByCoordinatesDto } from './dto/restaurants.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { RestaurantDto } from './dto/restaurants-response.dto';
import { HttpExceptionDto } from 'src/auth/dto/auth-response.dto';

@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private readonly restaurantsService: RestaurantsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('coordinates')
    @ApiResponse({
        status: 200,
        description: 'List of restaurants near the given coordinates',
        type: RestaurantDto,
        isArray: true,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request parameters',
        type: HttpExceptionDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized access',
        type: HttpExceptionDto,
    })
    async getRestaurantsByCoordinates(
        @Query() query: getRestaurantsByCoordinatesDto,
        @User('userId') userId: number,
    ) {
        return await this.restaurantsService.getRestaurantsByCoordinates(userId, query.lat, query.lng);
    }

    @UseGuards(JwtAuthGuard)
    @Get('city')
    @ApiResponse({
        status: 200,
        description: 'List of restaurants in the given city',
        type: RestaurantDto,
        isArray: true,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid request parameters',
        type: HttpExceptionDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized access',
        type: HttpExceptionDto,
    })
    async getRestaurantsByCity(
        @Query() query: getRestaurantsByCityDto,
        @User('userId') userId: number,
    ) {
        return await this.restaurantsService.getRestaurantsByCity(userId, query.city);
    }
}
