import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OpenAI } from 'openai';
import { envConstant } from '@constants/index';
import { EmbeddingService } from '@modules/common/services/embedding.service';

@WebSocketGateway({
  cors: true,
  namespace: '/',
})
export class ChatGateway {
  @WebSocketServer() server: Server;
  private readonly openai: OpenAI;

  constructor(private readonly embeddingService: EmbeddingService) {
    this.openai = new OpenAI({
      apiKey: envConstant.OPENAI_API_KEY,
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('query')
  async handleQuery(
    @MessageBody() data: { query: string; documentIds: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const { query, documentIds } = data;

    // Notify user that AI is processing
    client.emit('processing', { message: 'AI is thinking...' });

    try {
      const relevantChunks = await this.embeddingService.queryEmbedding(
        documentIds,
        query,
      );
      const context = relevantChunks.join('\n');
      // Create OpenAI stream
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant providing accurate information.',
          },
          {
            role: 'user',
            content: `Context: ${context}\nUser Query: ${query}`,
          },
        ],
        stream: true, // Enable streaming
      });

      let fullResponse = '';

      // Read the stream token-by-token
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || '';
        fullResponse += token;

        // Emit token to user in real-time
        client.emit('response', { text: token });
      }

      // Emit final response
      client.emit('done', { text: fullResponse });
    } catch (error) {
      console.error('Error:', error);
      client.emit('error', { message: 'Error processing your request.' });
    }
  }

  @SubscribeMessage('get-context')
  async handleGetContext(
    @MessageBody() data: { query: string; documentIds: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const { query, documentIds } = data;

    try {
      // Get relevant chunks from documents
      const relevantChunks = await this.embeddingService.queryEmbedding(
        documentIds,
        query,
      );
      const context = relevantChunks.join('\n');

      // Send context back to client
      client.emit('context', { context });
    } catch (error) {
      console.error('Error:', error);
      client.emit('error', { message: 'Error getting context.' });
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
