import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { GenerateExamService } from './generate-exam.service';
import { ExamDto } from './dto/exam.dto';

@Controller('generate-exam')
export class GenerateExamController {
  constructor(private readonly generateExamService: GenerateExamService) {}

  @Get('say-hello')
  sayHello() {
    return this.generateExamService.sayHello();
  }
  @Post()
  generateExam(@Body(ValidationPipe) examDto: ExamDto) {
    console.log(examDto);
    return this.generateExamService.generateExam(examDto);
  }
}
