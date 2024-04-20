import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prismaService';
import { Transport } from '@prisma/client';

@Injectable()
export class TransportService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllTransport(): Promise<any> {
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
    async addTransport(body: Transport): Promise<Transport> {
        try {
            const transport = await this.prisma.transport.create({
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
    }
    async updateTransport(body: Transport): Promise<Transport> {
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
    }
}