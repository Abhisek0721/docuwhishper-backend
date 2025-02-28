import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { envConstant } from '@constants/index';


@Injectable()
export class EmbeddingService {
  private readonly openai: OpenAI;
  private readonly pinecone: Pinecone;

  constructor() {
    this.openai = new OpenAI({
      apiKey: envConstant.OPENAI_API_KEY,
    });

    this.pinecone = new Pinecone({
      apiKey: envConstant.PINECONE_API_KEY,
    });
  }

  async storePdfEmbeddings(docId: string, text: string) {
    const textChunks = this.splitTextIntoChunks(text, 500);

    for (const [i, chunk] of textChunks.entries()) {
      const embedding = await this.getEmbedding(chunk);

      await this.pinecone.index('docuwhisper').upsert([
        {
          id: `${docId}_chunk_${i}`,
          values: embedding,
          metadata: { text: chunk, documentId: docId },
        },
      ]);
    }
  }

  async queryEmbedding(documentId: string, query: string) {
    const queryEmbedding = await this.getEmbedding(query);

    const result = await this.pinecone.index('docuwhisper').query({
      filter: { documentId },
      vector: queryEmbedding,
      topK: 1000, // Get top 5 relevant chunks
      includeMetadata: true,
    });

    return result.matches.map((match) => match.metadata.text);
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  }

  private splitTextIntoChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    const pattern = new RegExp(`.{1,${chunkSize}}`, 'g');
    let match;
    while ((match = pattern.exec(text)) !== null) {
      chunks.push(match[0]);
    }
    return chunks;
  }
}
