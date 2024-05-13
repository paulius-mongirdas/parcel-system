import { Module } from "@nestjs/common";
import { CenterService } from "./CenterService";
import { CenterController } from "./CenterController";
import { PrismaModule } from "../../prisma/PrismaModule";

@Module({
    imports: [PrismaModule],
    controllers: [CenterController],
    providers: [CenterService],
})
export class CenterModule { }