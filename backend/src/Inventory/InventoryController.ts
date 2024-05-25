import { Controller, Post, Body, Get, Query, Req, Put, Param, Delete } from '@nestjs/common';
import { InventoryService } from './InventoryService';
import { Package } from '@prisma/client';

enum Status {
    CREATED = "CREATED",
    IN_DELIVERY = "IN_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED",
    NOT_DELIVERED = "NOT_DELIVERED",
}
interface FilterData {
    createdDateFrom: Date;
    createdDateTo: Date;
    deliveredDateFrom: Date;
    deliveredDateTo: Date;

    status: string[];
    priceFrom: number;
    priceTo: number;
    weightFrom: number;
    weightTo: number;
}

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get('all')
    async select(): Promise<any> {
        return this.inventoryService.select();
    }
    @Put('update')
    async update(@Body() body: Package): Promise<Package> {
        return this.inventoryService.update(body);
    }
    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<Package> {
        return this.inventoryService.delete(id);
    }
    @Post('report')
    async selectItems(@Body() query: FilterData): Promise<Package[]> {
        return this.inventoryService.filter(query);
    }
}