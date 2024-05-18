import { Module } from "@nestjs/common";
import { InventoryService } from "./InventoryService";
import { InventoryController } from "./InventoryController";
import { PrismaModule } from "../../prisma/PrismaModule";

@Module({
    imports: [PrismaModule],
    controllers: [InventoryController],
    providers: [InventoryService],
})
export class InventoryModule { }