import { Module } from '@nestjs/common';
import { CarModule } from './Car/CarModule';
import { CenterModule } from './Center/CenterModule';
import { PackageModule } from './Package/PackageModule';
import { MessageModule } from './Message/MessageModule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/PrismaModule';
import { InventoryModule } from './Inventory/InventoryModule';
import { RouteModule } from './Route/RouteModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CarModule,
    CenterModule,
    InventoryModule,
    PackageModule,
    MessageModule,
    RouteModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}