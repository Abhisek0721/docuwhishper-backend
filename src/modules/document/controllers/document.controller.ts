import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { DocumentService } from '../services/document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/common/decorators/user.decorator';
import { JwtDto } from 'src/common/dtos/jwt.dto';
import type { Express } from 'express';
import JwtAuthGuard from '@modules/auth/guards/jwt-auth.guard';

@Controller('document')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly apiUtilsService: ApiUtilsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(
    @GetUser() user: JwtDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.documentService.uploadDocument(file, user);
    return this.apiUtilsService.make_response(data);
  }

  @Get('content/:documentId')
  async getDocumentContent(@Param('documentId') documentId: string) {
    const data = await this.documentService.getDocumentContent(documentId);
    return this.apiUtilsService.make_response(data);
  }

  @Get()
  async getAllDocuments(@GetUser() user: JwtDto) {
    const data = await this.documentService.getAllDocuments(user);
    return this.apiUtilsService.make_response(data);
  }

  @Delete(':documentId')
  async deleteDocument(@Param('documentId') documentId: string) {
    const data = await this.documentService.deleteDocument(documentId);
    return this.apiUtilsService.make_response(data);
  }
}
