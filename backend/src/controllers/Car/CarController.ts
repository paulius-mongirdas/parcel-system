import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
import { CarService } from './CarService';

@Controller('transport')
export class CarController {
    constructor(private readonly carService: CarService) { }

    @Get('all')
    async getAllTransport(): Promise<any> {
        return this.carService.getAllTransport();
    }
}