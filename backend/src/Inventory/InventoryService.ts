import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prismaService';
import { Package } from '@prisma/client';

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
                    id:  Number(id)
                }
            });
            return item;
        } catch (error) {
            throw error;
        }
    }
}