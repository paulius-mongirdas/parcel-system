import { Controller, Post, Body, Get, Query, Req, Put, Param, Delete } from '@nestjs/common';
import { CarService } from './CarService';
import { Transport } from '@prisma/client';

@Controller('transport')
export class CarController {
    constructor(private readonly carService: CarService) { }

    @Get('all')
    async select(): Promise<any> {
        return this.carService.select();
    }
    @Post('add')
    async insertCar(@Body() body: Transport): Promise<Transport> {
        return this.carService.insertCar(body);
    }
    @Put('update')
    async update(@Body() body: Transport): Promise<Transport> {
        return this.carService.update(body);
    }
    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<Transport> {
        return this.carService.delete(id);
    }
}