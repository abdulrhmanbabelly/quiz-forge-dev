import { Test, TestingModule } from '@nestjs/testing';
import { GenerateExamController } from './generate-exam.controller';

describe('GenerateExamController', () => {
  let controller: GenerateExamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateExamController],
    }).compile();

    controller = module.get<GenerateExamController>(GenerateExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
