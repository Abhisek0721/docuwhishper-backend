import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UtilsModule } from '@utils/utils.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from '@modules/common/common.module';
import { DocumentModule } from '@modules/document/document.module';
import { createPineconeIndex } from '@utils/functions/createPineconeIndex';
import { ChatModule } from '@modules/chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    UtilsModule,
    CommonModule,
    UserModule,
    AuthModule,
    DocumentModule,
    ChatModule,
  ],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await createPineconeIndex();
  }
}
