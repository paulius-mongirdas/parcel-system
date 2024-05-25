import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prismaService';
import { Package } from '@prisma/client';

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

@Injectable()
export class InventoryService {
    constructor(private readonly prisma: PrismaService) { }

    async select(): Promise<any> {
        try {
            const items = await this.prisma.package.findMany({
                orderBy: {
                    id: 'asc'
                },
            });

            return items;
        } catch (error) {
            throw error;
        }
    }

    async update(body: Package): Promise<Package> {
        try {
            const item = await this.prisma.package.update({
                where: { id: body.id },
                data: {
                    address: body.address,
                    postalCode: body.postalCode,
                    city: body.city,
                    country: body.country,
                    length: body.length,
                    width: body.width,
                    height: body.height,
                    weight: body.weight,
                    status: body.status,
                    createdAt: body.createdAt,
                    deliveredAt: body.deliveredAt,
                    price: body.price
                },
            });
            return item;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<Package> {
        try {
            const item = await this.prisma.package.delete({
                where: {
                    id: Number(id)
                }
            });
            return item;
        } catch (error) {
            throw error;
        }
    }

    async filter(query: FilterData): Promise<Package[]> {
        try {
            console.log(query);
            const items = await this.prisma.package.findMany({
                where: {
                    AND: [
                        { createdAt: { gte: query.createdDateFrom } },
                        { createdAt: { lte: query.createdDateTo } },
                        { deliveredAt: { gte: query.deliveredDateFrom } },
                        { deliveredAt: { lte: query.deliveredDateTo } },
                        { status: { in: query.status } },
                        { price: { gte: query.priceFrom } },
                        { price: { lte: query.priceTo } },
                        { weight: { gte: query.weightFrom } },
                        { weight: { lte: query.weightTo } }
                    ]
                }
            });
            return items;
        } catch (error) {
            throw error;
        }
    }
}