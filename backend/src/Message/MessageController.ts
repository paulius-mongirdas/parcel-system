import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MessageService } from './MessageService';
import { Message } from '@prisma/client';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @Post('add')
    async insertMessage(@Body() body: Message): Promise<Message> {
        try {
            return await this.messageService.insertMessage(body);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'There was a problem sending the message',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
