import { Injectable } from "@nestjs/common";
import { AIQueryService } from "@modules/common/services/ai-query.service";


@Injectable()
export class ChatService {
  constructor(private readonly aiQueryService: AIQueryService) {}

  async query(documentId: string, query: string) {
    const response = await this.aiQueryService.generateResponse(documentId, query);
    return response;
  }
}



