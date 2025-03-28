import { Injectable, InternalServerErrorException } from '@nestjs/common';
import ollama from 'ollama';
import { ExamDto, QuestionGroup, QuestionType } from './dto/exam.dto';
import { HuggingFaceService } from 'src/hugging-face/hugging-face.service';
import { TextGenerationOutput } from '@huggingface/inference';

@Injectable()
export class GenerateExamService {
  constructor(private readonly huggingFaceService: HuggingFaceService) {}
  async sayHello() {
    const response = await this.huggingFaceService.hf.textGeneration({
      model: 'google/gemma-3-27b-it',
      inputs:
        'what is your name and your exact version with exact number of parameters is it 1b',
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
  
      and give the questions and answers in the following JSON structure
      don't give me anything other than the JSON i asked for not a single dot more
      JSON STRUCTURE : { question : "question text here", choices: ["choices here"], answer : "answer"}
    `;

    const trueFalseInput = `
      TEXT : ${text}
      give me ${questionGroup.number} true or false question 
      1. The questions focus on the core concepts and main ideas of the text.
      2. The questions are structured in a way that resembles a real exam, with clear and concise wording.  
      3. give only the statement itself without saying "true or false" or anything like it only the statement itself
      and give the questions and answers in the following JSON structure
      don't give me anything other than the JSON i asked for not a single dot more
      JSON STRUCTURE : { question : "question text here", answer : "answer either true or false"}

      `;

    const classicalQuestion = `
        TEXT : ${text}
        give me ${questionGroup.number} normal question meaning the answer of this question is a text not choices or yes or no it is a written answer 
        1. The questions focus on the core concepts and main ideas of the text.
        2. The questions are structured in a way that resembles a real exam, with clear and concise wording.  
        and give the questions and answers in the following JSON structure
        don't give me anything other than the JSON i asked for not a single dot more
        JSON STRUCTURE : { question : "question text here", answer : "answer"}
    
        `;
    const typeToInput = {
      [QuestionType.MULTIPLE_CHOICES]: multipleChoiceInput,
      [QuestionType.TRUE_FALSE]: trueFalseInput,
      [QuestionType.CLASSICAL]: classicalQuestion,
    };

    const input: string = typeToInput[questionGroup.type];
    if (input) {
      /*
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
        */
      let response: TextGenerationOutput = { generated_text: '' };
      try {
        response = await this.huggingFaceService.hf.textGeneration({
          modle: 'google/gemma-3-27b-it',
          inputs: input,
        });
        console.log(response.generated_text);
        return response.generated_text
          .replaceAll('\n', '')
          .match(/(json|javascript).*?```/)?.[0]
          .replaceAll('`', '')
          .replaceAll('json', '')
          .replaceAll('javascript', '');
      } catch (e) {
        console.error(e);
        throw new Error(e);
      }
    } else {
      throw new InternalServerErrorException();
    }
  }

  async generateExam(examDto: ExamDto) {
    const questionGroups = examDto.questionGroups.map((qg) =>
      this.generateQuestionGroup(qg, examDto.text),
    );
    const result = (await Promise.all(questionGroups)).map((e) => {
      try {
        if (typeof e == 'string') {
          const parsedJson = (JSON.parse(e) as object) ?? {};
          return parsedJson;
        } else return {};
      } catch (err) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error: err,
          question: e,
        };
      }
    });
    if (result) return result;
    else throw new InternalServerErrorException();
  }
}
/* 
    const response = await this.huggingFaceService.hf.textGeneration({
      modle: 'google/gemma-3-27b-it',
      inputs: input,
    }); */
