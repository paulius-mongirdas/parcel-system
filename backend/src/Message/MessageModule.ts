import { Module } from "@nestjs/common";
import { MessageService } from "./MessageService";
import { MessageController } from "./MessageController";
import { PrismaModule } from "../../prisma/PrismaModule";

@Module({
    imports: [PrismaModule],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule { }