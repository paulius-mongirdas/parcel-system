import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prismaService';
import { Package } from '@prisma/client';
import axios from 'axios';
import { PackageData, TransportData } from './interfaces';

@Injectable()
export class RouteService {
    constructor(private readonly prisma: PrismaService) { }

    calculateVolume(length: number, width: number, height: number): number {
        return length * width * height;
    }

    async calculateDistance(centerAddress: string, packageAddress: string): Promise<number> {
        const apiKey = 'AIzaSyBFsTW0Z6atmDnBTAC4XRPHeO_wYiW2Hws';
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(centerAddress)}&destinations=${encodeURIComponent(packageAddress)}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK' && response.data.rows[0].elements[0].status === 'OK') {
                const distanceInMeters = response.data.rows[0].elements[0].distance.value;
                return distanceInMeters / 1000; // Convert to kilometers
            } else {
                throw new Error('Error calculating distance');
            }
        } catch (error) {
            throw new Error('Error calculating distance: ' + error.message);
        }
    }

    checkCar(transport: TransportData, distance: number): boolean {
        if (transport.type === 'local van' && distance < 25) {
            return true;
        } else if (transport.type === 'long journey van' && distance >= 25 && distance <= 100) {
            return true;
        } else if (transport.type === 'truck' && distance > 100) {
            return true;
        }
        return false;
    }

    async sortPackages(
        transport: TransportData,
        centerAddress: string,
        packages: PackageData[]
    ): Promise<{ acceptedPackages: PackageData[] }> {

        const [volumes, distances] = await Promise.all([
            Promise.all(packages.map(pkg => this.calculateVolume(pkg.length, pkg.width, pkg.height))),
            Promise.all(packages.map(pkg => 
                this.calculateDistance(centerAddress, `${pkg.address}, ${pkg.city}, ${pkg.country}`)
            ))
        ]);

        let totalVolume = 0;
        let totalWeight = 0;
        const acceptedPackages: PackageData[] = [];

        for (let i = 0; i < packages.length; i++) {
            const pkg = packages[i];
            const volume = volumes[i];
            const distance = distances[i];

            if (this.checkCar(transport, distance) && totalVolume + volume <= transport.capacity && totalWeight + pkg.weight <= transport.weight) {
                totalVolume += volume;
                totalWeight += pkg.weight;
                acceptedPackages.push({ ...pkg, transportId: transport.id });
            }
        }

        return { acceptedPackages };
    }
}
