import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CloudinaryService {
  constructor(private readonly httpService: HttpService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  getStorage() {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        // @ts-ignore
        folder: 'pdf-uploads',
        format: async () => 'pdf',
        resource_type: 'raw',
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    return cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      { resource_type: 'raw' },
    );
  }

  async deleteFile(url: string) {
    const publicId = url.split('/').pop().split('.')[0];
    return cloudinary.uploader.destroy(publicId);
  }

  async getFile(url: string) {
    const response = await lastValueFrom(
      this.httpService.get(url, { responseType: 'arraybuffer' }),
    );
    const pdfBuffer = Buffer.from(response.data);
    return pdfBuffer;
  }
}
