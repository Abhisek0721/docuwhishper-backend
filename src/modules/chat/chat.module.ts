import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './services/chat.websocket';
@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
