import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prismaService';
import { Transport } from '@prisma/client';

@Injectable()
export class CarService {
    constructor(private readonly prisma: PrismaService) { }

    async select(): Promise<any> {
        try {
            const transports = await this.prisma.transport.findMany({
                orderBy: {
                    id: 'asc'
                },
            });

            return transports;
        } catch (error) {
            throw error;
        }
    }
    async insertCar(body: Transport): Promise<Transport> {
        try {
            if (body.centerId != -1) {
                const transport = await this.prisma.transport.create({
                    data: {
                        type: body.type,
                        capacity: body.capacity,
                        averageSpeed: body.averageSpeed,
                        center: {
                            connect: {
                                id: body.centerId
                            }
                        }
                    }
                });
                return transport;
            }
            else {
                const transport = await this.prisma.transport.create({
                    data: {
                        type: body.type,
                        capacity: body.capacity,
                        averageSpeed: body.averageSpeed,
                        centerId: null,
                    }
                });
                return transport;
            }
        } catch (error) {
            throw error;
        }
    }
    async update(body: Transport): Promise<Transport> {
        try {
            if (body.centerId != -1) {
                const transport = await this.prisma.transport.update({
                    where: {
                        id: body.id
                    },
                    data: {
                        type: body.type,
                        capacity: body.capacity,
                        averageSpeed: body.averageSpeed,
                        center: {
                            connect: {
                                id: body.centerId
                            }
                        }
                    }
                });
                return transport;
            }
            else {
                const transport = await this.prisma.transport.update({
                    where: {
                        id: body.id
                    },
                    data: {
                        type: body.type,
                        capacity: body.capacity,
                        averageSpeed: body.averageSpeed,
                        centerId: null,
                    }
                });
                return transport;
            }
        } catch (error) {
            throw error;
        }
    }
    async delete(id: number): Promise<Transport> {
        try {
            const transport = await this.prisma.transport.delete({
                where: {
                    id: Number(id)
                }
            });
            return transport;
        } catch (error) {
            throw error;
        }
    }
}