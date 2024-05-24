import { Module } from '@nestjs/common';
import { CarModule } from './Car/CarModule';
import { CenterModule } from './Center/CenterModule';
import { PackageModule } from './Package/PackageModule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/PrismaModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CarModule,
    CenterModule,
    PackageModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}