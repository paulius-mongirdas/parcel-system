import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prismaService';

@Injectable()
export class CarService {
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
}