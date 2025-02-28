import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';
import { HttpModule } from '@nestjs/axios';
import { EmbeddingService } from './services/embedding.service';
import { AIQueryService } from './services/ai-query.service';
@Global()
@Module({
  imports: [
    HttpModule,
  ],
  controllers: [],
  providers: [CloudinaryService, EmbeddingService, AIQueryService],
  exports: [CloudinaryService, EmbeddingService, AIQueryService],
})
export class CommonModule {}
