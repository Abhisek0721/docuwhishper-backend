import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OpenAI } from 'openai';
import { envConstant } from '@constants/index';
@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: envConstant.OPENAI_API_KEY,
    });
  }

  @SubscribeMessage('query')
  async handleQuery(@MessageBody() data: { query: string }) {
    const { query } = data;

    // Notify user that AI is processing
    this.server.emit('processing', { message: 'AI is thinking...' });

    try {
      // Create OpenAI stream
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: query }],
        stream: true, // Enable streaming
      });

      let fullResponse = '';

      // Read the stream token-by-token
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || '';
        fullResponse += token;

        // Emit token to user in real-time
        this.server.emit('response', { text: token });
      }

      // Emit final response
      this.server.emit('done', { text: fullResponse });
    } catch (error) {
      console.error('Error:', error);
      this.server.emit('error', { message: 'Error processing your request.' });
    }
  }

}
