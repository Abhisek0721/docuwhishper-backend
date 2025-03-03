import {
  Injectable,
  Logger,
} from '@nestjs/common';
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

  async query(documentId: string, query: string) {
    const response = await this.aiQueryService.generateResponse(
      documentId,
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
        }
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
