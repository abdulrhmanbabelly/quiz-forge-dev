import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerateExamModule } from './generate-exam/generate-exam.module';
import { HuggingFaceModule } from './hugging-face/hugging-face.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), GenerateExamModule, HuggingFaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
