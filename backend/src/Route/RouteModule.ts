import { Module } from "@nestjs/common";
import { RouteService } from "./RouteService";
import { RouteController } from "./RouteController";
import { PrismaModule } from "../../prisma/PrismaModule";

@Module({
    imports: [PrismaModule],
    controllers: [RouteController],
    providers: [RouteService],
})
export class RouteModule { }