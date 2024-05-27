import { Controller, Post, Body, Get, Query, Req, Put, Param, Delete ,ParseIntPipe} from '@nestjs/common';
import { RouteService } from './RouteService';
import { Package } from '@prisma/client';
import { PackageData, TransportData } from './interfaces';


@Controller('route')
export class RouteController {
    constructor(private readonly routeService: RouteService) { }
    

    @Post('calculate-volume')
    calculateVolume(@Body() body: { length: number; width: number; height: number }): { volume: number } {
        const { length, width, height } = body;
        const volume = this.routeService.calculateVolume(length, width, height);
        return { volume };
    }

    @Post('calculate-distance')
    async calculatePackageDistance(@Body() body: { startLocation: string; endLocation: string }): Promise<{ distance: number }> {
        const { startLocation, endLocation } = body;
        const distance = await this.routeService.calculateDistance(startLocation, endLocation);
        return { distance };
    }

    @Post('sort-packages')
    async sortPackages(
        @Body() body: { transport: TransportData, centerAddress: string, packages: PackageData[] }
    ): Promise<{ acceptedPackages: PackageData[] }> {
        const { transport, centerAddress, packages } = body;
        return await this.routeService.sortPackages(transport, centerAddress, packages);
    }
   
}