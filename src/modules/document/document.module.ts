import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DocumentController } from './controllers/document.controller';
import { DocumentService } from './services/document.service';
@Module({
  imports: [HttpModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
