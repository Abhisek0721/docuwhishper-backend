import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtDto } from 'src/common/dtos/jwt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from '@modules/common/services/cloudinary.service';
import * as pdfParse from 'pdf-parse';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { EmbeddingService } from '@modules/common/services/embedding.service';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly httpService: HttpService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async uploadDocument(file: Express.Multer.File, user: JwtDto) {
    try {
      const uploadedFile = await this.cloudinaryService.uploadFile(file);
      const document = await this.prisma.document.create({
        data: {
          filename: `${file.originalname}-${Date.now()}`,
          url: uploadedFile.url,
          userId: user.userId,
        },
      });
      this.extractTextFromDocument(uploadedFile.url, document.id);
      return document;
    } catch (error) {
      if (error?.status === 500 || error?.statusCode === 500) {
        this.logger.error(error?.stack);
      }
      throw error;
    }
  }

  private async extractTextFromDocument(url: string, documentId: string) {
    try {
      // Fetch the PDF file
      const response = await lastValueFrom(
        this.httpService.get(url, { responseType: 'arraybuffer' }),
      );
      const pdfBuffer = Buffer.from(response.data);

      // Extract text from PDF
      const pdfData = await pdfParse(pdfBuffer);
      const extractedText = pdfData.text;
      this.embeddingService.storePdfEmbeddings(documentId, extractedText);
      // Update document with extracted text
      await this.prisma.document.update({
        where: { id: documentId },
        data: { content: extractedText },
      });

      this.logger.log(`Document ${documentId} processed successfully.`);
    } catch (error) {
      if (error?.status === 500 || error?.statusCode === 500) {
        this.logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getDocumentContent(documentId: string) {
    try {
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
        select: {
          content: true,
        }
      });
      return { content: document?.content || null };
    } catch (error) {
      if (error?.status === 500 || error?.statusCode === 500) {
        this.logger.error(error?.stack);
      }
      throw error;

    }
  }

  async getAllDocuments(user: JwtDto) {
    try {
      const documents = await this.prisma.document.findMany({
        where: {
          userId: user.userId
        },
        select: {
          id: true,
          filename: true,
          uploadedAt: true,
        },
        orderBy: {
          uploadedAt: 'desc',
        },
      })
      return documents;
    } catch (error) {
      if (error?.status === 500 || error?.statusCode === 500) {
        this.logger.error(error?.stack);
      }
      throw error;
    }
  }

  async deleteDocument(documentId: string) {
    try {
      const checkDocument = await this.prisma.document.findUnique({
        where: {
          id: documentId
        }
      });
      if (!checkDocument) {
        throw new NotFoundException('Document not found');
      }
      const document = await this.prisma.document.delete({
        where: {
          id: documentId
        }
      });
      this.cloudinaryService.deleteFile(document.url);
      return { message: 'Document deleted successfully' };
    } catch (error) {
      if (error?.status === 500 || error?.statusCode === 500) {
        this.logger.error(error?.stack);
      }
      throw error;  
    }
  }

}
