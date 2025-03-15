import { Injectable } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class HuggingFaceService {
  readonly hf: HfInference;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.hf = new HfInference(process.env.API_KEY);
  }
}
