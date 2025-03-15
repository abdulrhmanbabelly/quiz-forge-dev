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
    const input = `${examDto.text}
    give me 4 multiple choice question with the 3 choices for each question
    and give it in the following JSON structure don't give me anything other than the JSON i asked for not a single dot more
    { multipleChoice: [{ question : "question text here", choices: ["choices here"], answer : "answer"}] }`;
    const response = await this.huggingFaceService.hf.textGeneration({
      modle: 'google/gemma-3-27b-it',
      inputs: input,
    });
    return response.generated_text
      .replaceAll('\n', '')
      .replaceAll('```', '')
      .match(/json.*/)?.[0]
      .substring(4);

    /*    
    const response = await ollama.chat({
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
