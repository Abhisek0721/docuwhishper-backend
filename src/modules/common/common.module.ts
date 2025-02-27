import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CommonModule {}
