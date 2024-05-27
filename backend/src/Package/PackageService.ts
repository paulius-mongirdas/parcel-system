import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prismaService';
import { Package } from '@prisma/client';

@Injectable()
export class PackageService {
    constructor(private readonly prisma: PrismaService) { }

    async select(): Promise<any> {
        try {
            const packages = await this.prisma.package.findMany({
                orderBy: {
                    id: 'asc'
                  },
            });
            
            return packages;
        } catch (error) {
            throw error;
        }
    }
    async selectFiltered(centerId: number): Promise<any> {
        try {
            const packages = await this.prisma.package.findMany({
                where: {
                    centerId: centerId,
                    transportId: null
                },
                orderBy: {
                    id: 'asc'
                },
            });
    
            return packages;
        } catch (error) {
            throw error;
        }
    }
    async insertPackage(body: Package): Promise<Package> {
        try {
            const parcel = await this.prisma.package.create({
                data: {
                    address: body.address,
                    city: body.city,
                    country: body.country,
                    postalCode: body.postalCode,
                    length: body.length,
                    width: body.width,
                    height: body.height,
                    weight: body.weight,
                    status: body.status,
                    createdAt: body.createdAt,
                    deliveredAt: body.deliveredAt,
                    price: body.price,
                    center: {
                        connect: { id: body.centerId }
                    }
                }
            });
            return parcel;
        } catch (error) {
            throw error;
        }
    }
    async update(body: Package): Promise<Package> {
        try {
            const parcel = await this.prisma.package.update({
                where: {
                    id: body.id
                },
                data: {
                    address: body.address,
                    city: body.city,
                    country: body.country,
                    postalCode: body.postalCode,
                    length: body.length,
                    width: body.width,
                    height: body.height,
                    weight: body.weight,
                    status: body.status,
                    createdAt: body.createdAt,
                    deliveredAt: body.deliveredAt,
                    price: body.price
                }
            });
            return parcel;
        } catch (error) {
            throw error;
        }
    }
    async updateStatus(id: number): Promise<Package> {
        try {
            const parcel = await this.prisma.package.update({
                where: {
                    id: Number(id)
                },
                data: {
                    status: "DELIVERED",
                    deliveredAt: new Date() 
                }
            });
            return parcel;
        } catch (error) {
            throw error;
        }
    }
    async updateTransport(id: number, transportId): Promise<Package> {
        try {
            const parcel = await this.prisma.package.update({
                where: {
                    id: Number(id)
                },
                data: {
                    transportId: Number(transportId)
                }
            });
            return parcel;
        } catch (error) {
            throw error;
        }
    }
    
    async delete(id: number): Promise<Package> {
        try {
            const parcel = await this.prisma.package.delete({
                where: {
                    id:  Number(id)
                }
            });
            return parcel;
        } catch (error) {
            throw error;
        }
    }

    async calculateRegularPrice(distance: number, weight: number, length: number, width: number, height: number): Promise<number> {
        let volume = length * width * height;
        let distancePrice = distance * 0.0025;
        let weightPrice = weight * 0.5;
        let volumePrice = volume * 0.0002;
        return distancePrice + weightPrice + volumePrice;
    }

    async calculateFastDeliveryPrice(distance: number, weight: number, length: number, width: number, height: number): Promise<number> {
        let volume = length * width * height;
        let distancePrice = distance * 0.0025;
        let weightPrice = weight * 0.5;
        let volumePrice = volume * 0.0002;
        let multiplier = 1.375;
        return (distancePrice + weightPrice + volumePrice) * multiplier;
    }

    async calculateSameDayPrice(distance: number, weight: number, length: number, width: number, height: number): Promise<number> {
        let volume = length * width * height;
        let distancePrice = distance * 0.0025;
        let weightPrice = weight * 0.5;
        let volumePrice = volume * 0.0002;
        let multiplier = 1.85;
        return (distancePrice + weightPrice + volumePrice) * multiplier;
    }

    async checkIfInsuranceNeeded(distance: number, weight: number, length: number, width: number, height: number): Promise<boolean> {
        if (weight * length * width * height > 200000 || distance > 100000) {
            return true;
        }
        return false;
    }

    async updatePricesWithInsurances(price: number): Promise<number> {
        return price + 10;
    }

    async checkIfCustomsTaxNeeded(country: string): Promise<boolean> {
        if (country === "US") {
            return true;
        }
        return false;
    }

    async updatePriceWithCustomsTax(weight: number, price: number): Promise<number> {
        return price + 20;
    }

    async calculatePrice(country: string, distance: number, weight: number, length: number, width: number, height: number): Promise<Number[]> {
        const [regularPrice, fastDeliveryPrice, sameDayPrice] = await Promise.all([
            this.calculateRegularPrice(distance, weight, length, width, height),
            this.calculateFastDeliveryPrice(distance, weight, length, width, height),
            this.calculateSameDayPrice(distance, weight, length, width, height)
        ]);
        let prices = [
            regularPrice,
            fastDeliveryPrice,
            sameDayPrice
        ];

        const insuranceNeeded = await this.checkIfInsuranceNeeded(distance, weight, length, width, height);
        if (insuranceNeeded) {
            prices = await Promise.all(prices.map(async (p) => {
                p = await this.updatePricesWithInsurances(p);
                return p;
            }));
        }

        const customsTaxNeeded = await this.checkIfCustomsTaxNeeded(country);
        if (customsTaxNeeded) {
            prices = await Promise.all(prices.map(async (p) => {
                p = await this.updatePriceWithCustomsTax(weight, p);
                return p;
            }));
        }
        return prices;
    }
}