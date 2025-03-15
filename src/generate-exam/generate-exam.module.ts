import { Module } from '@nestjs/common';
import { GenerateExamService } from './generate-exam.service';
import { GenerateExamController } from './generate-exam.controller';
import { HuggingFaceModule } from 'src/hugging-face/hugging-face.module';
import { HuggingFaceService } from 'src/hugging-face/hugging-face.service';

@Module({
  imports: [HuggingFaceModule],
  providers: [GenerateExamService, HuggingFaceService],
  controllers: [GenerateExamController],
})
export class GenerateExamModule {}
