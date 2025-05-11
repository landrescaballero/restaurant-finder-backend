import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check server status' })
  @ApiResponse({
    status: 200,
    description: 'Server is online',
    schema: {
      example: 'OK!' , 
    },
  })
  getHealth(): string {
    return this.appService.getHealth();
  }
}
