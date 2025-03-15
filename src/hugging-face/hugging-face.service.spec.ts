import { Test, TestingModule } from '@nestjs/testing';
import { HuggingFaceService } from './hugging-face.service';

describe('HuggingFaceService', () => {
  let service: HuggingFaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HuggingFaceService],
    }).compile();

    service = module.get<HuggingFaceService>(HuggingFaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
