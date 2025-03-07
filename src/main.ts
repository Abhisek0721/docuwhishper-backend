import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConstant } from './constants';
import { ValidationPipe } from '@nestjs/common';
import {
  BadGatewayExceptionFilter,
  BadRequestExceptionFilter,
  ForbiddenExceptionFilter,
  InternalServerExceptionFilter,
  UnauthorizedExceptionFilter,
} from '@filters/exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // for error handeling on receiving request
  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new BadGatewayExceptionFilter());
  app.useGlobalFilters(new InternalServerExceptionFilter());

  app.enableShutdownHooks();
  app.setGlobalPrefix('/api/v1', {
    exclude: ['/', 'socket.io'],
  });

  await app.listen(envConstant.PORT, () => {
    console.log(`Open: ${envConstant.BASE_URL}`);
  });
}
bootstrap();
