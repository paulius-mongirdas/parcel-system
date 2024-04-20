import { Module } from '@nestjs/common';
import { CarModule } from './controllers/Car/CarModule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/PrismaModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}