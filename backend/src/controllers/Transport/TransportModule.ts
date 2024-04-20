import { Module } from "@nestjs/common";
import { TransportService } from "./TransportService";
import { TransportController } from "./TransportController";
import { PrismaModule } from "../../../prisma/PrismaModule";

@Module({
    imports: [PrismaModule],
    controllers: [TransportController],
    providers: [TransportService],
})
export class TransportModule { }