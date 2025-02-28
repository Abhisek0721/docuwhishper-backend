import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import axios from 'axios';
import { envConstant } from '@constants/index';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;

  private readonly N8N_CHATBOT_WEBHOOK_URL = envConstant.N8N_CHATBOT_WEBHOOK_URL;

  @SubscribeMessage('query')
  async handleQuery(@MessageBody() data: { query: string }) {
    const { query } = data;

    // Immediately notify the user that processing has started
    this.server.emit('processing', { message: 'AI is thinking...' });

    try {
      // Send query to n8n Webhook
      const response = await axios.post(this.N8N_CHATBOT_WEBHOOK_URL, { query });

      // Emit the AI-generated response
      this.server.emit('response', { text: response.data.aiResponse });
    } catch (error) {
      console.error('Error:', error);
      this.server.emit('response', { text: 'Error processing your request.' });
    }
  }
}
