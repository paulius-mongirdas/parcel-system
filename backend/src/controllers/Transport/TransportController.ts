import { Controller, Post, Body, Get, Query, Req, Put, Param, Delete } from '@nestjs/common';
import { TransportService } from './TransportService';
import { Transport } from '@prisma/client';

@Controller('transport')
export class TransportController {
    constructor(private readonly carService: TransportService) { }

    @Get('all')
    async getAllTransport(): Promise<any> {
        return this.carService.getAllTransport();
    }
    @Post('add')
    async addTransport(@Body() body: Transport): Promise<Transport> {
        return this.carService.addTransport(body);
    }
    @Put('update')
    async updateTransport(@Body() body: Transport): Promise<Transport> {
        return this.carService.updateTransport(body);
    }
    @Delete('delete/:id')
    async deleteTransport(@Param('id') id: number): Promise<Transport> {
        return this.carService.deleteTransport(id);
    }
}