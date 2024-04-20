import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
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

}