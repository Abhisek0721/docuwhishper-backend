import { Body, Controller, Post, Res } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { ApiUtilsService } from '@utils/utils.service';
import { TextToSpeechDto } from '../dtos/textToSpeech.dto';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly apiUtilsService: ApiUtilsService,
  ) {}

  @Post('query')
  async query(@Body() body: { documentId: string; query: string }) {
    const response = await this.chatService.query(body.documentId, body.query);
    return this.apiUtilsService.make_response(response);
  }

  @Post('text-to-speech')
  async textToSpeech(@Body() dto: TextToSpeechDto, @Res() res: Response) {
    const response = await this.chatService.textToSpeech(dto);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    const readable = Readable.from(response.body);
    readable.pipe(res);
  }
}
