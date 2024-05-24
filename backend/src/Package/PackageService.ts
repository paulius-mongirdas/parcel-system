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
                    price: body.price
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