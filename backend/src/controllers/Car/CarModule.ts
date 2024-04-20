import { Module } from "@nestjs/common";
import { CarService } from "./CarService";
import { CarController } from "./CarController";
import { PrismaModule } from "../../../prisma/PrismaModule";

@Module({
    imports: [PrismaModule],
    controllers: [CarController],
    providers: [CarService],
})
export class CarModule { }