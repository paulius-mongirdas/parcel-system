import { Module } from "@nestjs/common";
import { PackageService } from "./PackageService";
import { PackageController } from "./PackageController";
import { PrismaModule } from "../../prisma/PrismaModule";

@Module({
    imports: [PrismaModule],
    controllers: [PackageController],
    providers: [PackageService],
})
export class PackageModule { }