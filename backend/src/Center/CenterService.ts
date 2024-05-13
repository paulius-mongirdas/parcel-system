import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prismaService';
import { Center } from '@prisma/client';

@Injectable()
export class CenterService {
    constructor(private readonly prisma: PrismaService) { }

    async select(): Promise<any> {
        try {
            const centers = await this.prisma.center.findMany({
                orderBy: {
                    id: 'asc'
                  },
            });
            
            return centers;
        } catch (error) {
            throw error;
        }
    }
    async insertCenter(body: Center): Promise<Center> {
        try {
            const center = await this.prisma.center.create({
                data: {
                    capacity: body.capacity,
                    address: body.address,
                    city: body.city,
                    country: body.country
                }
            });
            return center;
        } catch (error) {
            throw error;
        }
    }
    /*
    async update(body: Transport): Promise<Transport> {
        try {
            const transport = await this.prisma.transport.update({
                where: {
                    id: body.id
                },
                data: {
                    type: body.type,
                    capacity: body.capacity,
                    averageSpeed: body.averageSpeed
                }
            });
            return transport;
        } catch (error) {
            throw error;
        }
    }*/
    async delete(id: number): Promise<Center> {
        try {
            const center = await this.prisma.center.delete({
                where: {
                    id:  Number(id)
                }
            });
            return center;
        } catch (error) {
            throw error;
        }
    }
}