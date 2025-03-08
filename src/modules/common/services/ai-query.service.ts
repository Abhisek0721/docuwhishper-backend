import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import axios from 'axios';
import { EmbeddingService } from './embedding.service';
import { envConstant } from '@constants/index';

@Injectable()
export class AIQueryService {
  private readonly openai: OpenAI;

  constructor(private readonly embeddingService: EmbeddingService) {
    this.openai = new OpenAI({
      apiKey: envConstant.OPENAI_API_KEY,
    });
  }

  async getContext(documentIds: string[], query: string) {
    const relevantChunks = await this.embeddingService.queryEmbedding(
      documentIds,
      query,
    );
    return relevantChunks.join('\n');
  }

  async generateResponse(documentIds: string[], query: string) {
    const context = await this.getContext(documentIds, query);
    const chatResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant providing accurate information.',
        },
        { role: 'user', content: `Context: ${context}\nUser Query: ${query}` },
      ],
    });

    return { answer: chatResponse.choices[0].message.content };
  }

  async convertTextToSpeech(text: string) {
    const response = await axios.post(
      'https://api.assemblyai.com/v2/speech',
      { text },
      {
        headers: { Authorization: `Bearer ${process.env.ASSEMBLYAI_API_KEY}` },
      },
    );

    return response.data.audio_url;
  }
}
