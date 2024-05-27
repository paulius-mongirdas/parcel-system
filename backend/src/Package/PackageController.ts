import { Controller, Post, Body, Get, Query, Req, Put, Param, Delete ,ParseIntPipe} from '@nestjs/common';
import { PackageService } from './PackageService';
import { Package } from '@prisma/client';

@Controller('package')
export class PackageController {
    constructor(private readonly packageService: PackageService) { }

    @Get('all')
    async select(): Promise<any> {
        return this.packageService.select();
    }
    @Get('all/:id')
    async selectFiltered(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.packageService.selectFiltered(id);
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
    @Put('updatee/:id')
    async updateTransport(
      @Param('id') id: number,
      @Body('transportId') transportId: number,
    ): Promise<Package> {
      return this.packageService.updateTransport(id, transportId);
    }
    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<Package> {
        return this.packageService.delete(id);
    }
}