import { Injectable, InternalServerErrorException } from '@nestjs/common';
import ollama from 'ollama';
import { ExamDto, QuestionGroup, QuestionType } from './dto/exam.dto';
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
  async generateQuestionGroup(questionGroup: QuestionGroup, text: string) {
    const multipleChoiceInput = `
      TEXT : ${text}
      give me ${questionGroup.number} multiple choice question with the ${questionGroup.choiceNumber} choices for each question
      1. The questions focus on the core concepts and main ideas of the text.
      2. The choices for each question are closely related and plausible, making the exam difficult and thought-provoking.
      3. The questions are structured in a way that resembles a real exam, with clear and concise wording.
      4. choices must not include ordering or numbering just put the choice 
      Example : "1. first choice" this choice format is wrong because it contains "1."
      the correct choice format is "first choice"
  
      and give it in the following JSON structure
      JSON STRUCTURE : { question : "question text here", choices: ["choices here"], answer : "answer"}
      don't give me anything other than the JSON i asked for not a single dot more
      `;

    const trueFalseInput = `
      TEXT : ${text}
      give me ${questionGroup.number} true or false question 
      1. The questions focus on the core concepts and main ideas of the text.
      2. The questions are structured in a way that resembles a real exam, with clear and concise wording.  
      3. give only the statement itself without saying "true or false" or anything like it only the statement itself
      and give it in the following JSON structure
      JSON STRUCTURE : { question : "question text here", answer : "answer either true or false"}
      don't give me anything other than the JSON i asked for not a single dot more
      `;

    const classicalQuestion = `
    TEXT : ${text}
    give me ${questionGroup.number} normal question meaning the answer of this question is a text not choices or anything else 
    1. The questions focus on the core concepts and main ideas of the text.
    2. The questions are structured in a way that resembles a real exam, with clear and concise wording.  
    and give it in the following JSON structure
    JSON STRUCTURE : { question : "question text here", answer : "answer"}
    don't give me anything other than the JSON i asked for not a single dot more
    `;
    const typeToInput = {
      [QuestionType.MULTIPLE_CHOICES]: multipleChoiceInput,
      [QuestionType.TRUE_FALSE]: trueFalseInput,
      [QuestionType.CLASSICAL]: classicalQuestion,
    };

    const input: string = typeToInput[questionGroup.type];
    if (input) {
      const response = await ollama.chat({
        model: 'gemma3:1b',
        messages: [
          {
            role: 'user',
            content: input,
          },
        ],
      });

      return response.message.content
        .replaceAll('\n', '')
        .match(/json.*?```/)?.[0]
        .replaceAll('`', '')
        .substring(4);
    } else {
      throw new InternalServerErrorException();
    }
  }

  async generateExam(examDto: ExamDto) {
    const questionGroups = examDto.questionGroups.map((qg) =>
      this.generateQuestionGroup(qg, examDto.text),
    );
    const result = (await Promise.all(questionGroups)).map((e) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      JSON.parse(e as any),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (result) return result;
    else throw new InternalServerErrorException();
  }
}
