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
}