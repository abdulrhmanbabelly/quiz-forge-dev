import { Module } from '@nestjs/common';
import { HuggingFaceService } from './hugging-face.service';

@Module({
  providers: [HuggingFaceService],
})
export class HuggingFaceModule {}
