import { Module } from '@nestjs/common';
import { TransportModule } from './controllers/Transport/TransportModule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/PrismaModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TransportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}