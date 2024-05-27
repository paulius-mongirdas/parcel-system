import { Controller, Post, Body, Get, Query, Req, Put, Param, Delete } from '@nestjs/common';
import { PackageService } from './PackageService';
import { Package } from '@prisma/client';

@Controller('package')
export class PackageController {
    constructor(private readonly packageService: PackageService) { }

    @Get('all')
    async select(): Promise<any> {
        return this.packageService.select();
    }
    @Post('add')
    async insertPackage(@Body() body: Package): Promise<Package> {
        return this.packageService.insertPackage(body);
    }
    @Put('update')
    async update(@Body() body: Package): Promise<Package> {
        return this.packageService.update(body);
    }
    @Put('update/delivered/:id')
    async updateStatus(@Param('id') id: number): Promise<Package> {
        return this.packageService.updateStatus(id);
    }
    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<Package> {
        return this.packageService.delete(id);
    }
}