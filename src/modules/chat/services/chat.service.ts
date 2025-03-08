import { Injectable, Logger } from '@nestjs/common';
import { AIQueryService } from '@modules/common/services/ai-query.service';
import { TextToSpeechDto } from '../dtos/textToSpeech.dto';
import { ElevenLabsClient } from 'elevenlabs';
import { envConstant } from '@constants/index';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly elevenLabsclient = new ElevenLabsClient({
    apiKey: envConstant.ELEVEN_LABS_API_KEY,
  });

  constructor(private readonly aiQueryService: AIQueryService) {}

  async createSession() {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/realtime/sessions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${envConstant.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini-realtime-preview',
            modalities: ['text', 'audio'],
            voice: 'sage',
            instructions:
              "You are a helpful assistant and have some tools installed. You help people to get answers to users' questions. Your main goal is to answer user's meeting related questions. If the question is related to the meeting, you can use the installed tools. For conversation, always stick to English. If you detect any other language, just respond with an apology that you only support english for now",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`OpenAI API returned ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error('Error creating OpenAI session:', error);
      throw error;
    }
  }

  async getContext(documentIds: string[], query: string) {
    try {
      return await this.aiQueryService.getContext(documentIds, query);
    } catch (error) {
      this.logger.error('Error getting context:', error);
      throw error;
    }
  }

  async query(documentIds: string[], query: string) {
    const response = await this.aiQueryService.generateResponse(
      documentIds,
      query,
    );
    return response;
  }

  async textToSpeech(dto: TextToSpeechDto) {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${dto.voiceId}/stream`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': envConstant.ELEVEN_LABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: dto.text,
            model_id: dto.modelId || 'eleven_multilingual_v2',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed with status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (error.statusCode === 500 || error.statusCode === 401) {
        this.logger.error(error?.stack);
      }
      throw error;
    }
  }
}
