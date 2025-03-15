import { Test, TestingModule } from '@nestjs/testing';
import { GenerateExamService } from './generate-exam.service';

describe('GenerateExamService', () => {
  let service: GenerateExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateExamService],
    }).compile();

    service = module.get<GenerateExamService>(GenerateExamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
