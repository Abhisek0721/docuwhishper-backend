import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { ApiUtilsService } from '@utils/utils.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly apiUtilsService: ApiUtilsService,
  ) {}

  @Post('query')
  async query(@Body() body: { documentId: string, query: string }) {
    const response = await this.chatService.query(body.documentId, body.query);
    return this.apiUtilsService.make_response(response);
  }
}
