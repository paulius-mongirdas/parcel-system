import { Controller, Post, Body, Get, Query, Req, Put, Param, Delete } from '@nestjs/common';
import { CenterService } from './CenterService';
import { Center } from '@prisma/client';

@Controller('center')
export class CenterController {
    constructor(private readonly centerService: CenterService) { }

    @Get('all')
    async select(): Promise<any> {
        return this.centerService.select();
    }
    @Post('add')
    async insertCenter(@Body() body: Center): Promise<Center> {
        return this.centerService.insertCenter(body);
    }
    /*@Put('update')
    async update(@Body() body: Transport): Promise<Transport> {
        return this.carService.update(body);
    }*/
    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<Center> {
        return this.centerService.delete(id);
    }
}