import { Injectable } from '@nestjs/common';
import ollama from 'ollama';
import { ExamDto } from './dto/exam.dto';
import { HuggingFaceService } from 'src/hugging-face/hugging-face.service';

@Injectable()
export class GenerateExamService {
  constructor(private readonly huggingFaceService: HuggingFaceService) {}
  async sayHello() {
    const response = await ollama.chat({
      model: 'gemma3:1b',
      messages: [{ role: 'user', content: 'say hello' }],
    });
    return response;
  }
  async generateExam(examDto: ExamDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const response = await this.huggingFaceService.hf.textGeneration({
      modle: 'google/gemma-3-27b-it',
      inputs: `${examDto.text}
        create an exam from the previous text with 4 multiple choice question with the 3 choices for each question  {
           multipleChoice: [{ question : "question text here", choices: ["choices here"], answer : "answer"}]
       }`,
    });
    return response.generated_text.replaceAll('\n', '');

    /*     const response = await ollama.chat({
      model: 'gemma3:1b',
      messages: [
        {
          role: 'user',
          content: `${examDto.text}
           باللغة العربية، قم بإنشاء 4 أسئلة من النص السابق باستخدام مخطط json التالي
            {
                multipleChoice: [{ question : "ضع هنا نص السؤال", choices: ["ضع هنا الخيارات"], answer : "ضع هنا الجواب"}]
            }`,
        },
      ],
    });
    return response.message.content.replaceAll('\n', '');
 */
  }
}
