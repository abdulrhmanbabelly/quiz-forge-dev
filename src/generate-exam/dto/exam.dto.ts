import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// Define the enum for question types
export enum QuestionType {
  CLASSICAL = 'CLASSICAL',
  MULTIPLE_CHOICES = 'MULTIPLE_CHOICES',
  TRUE_FALSE = 'TRUE_FALSE',
}
export class QuestionGroup {
  @IsEnum(QuestionType, {
    message: 'valid type required',
  })
  type: QuestionType;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsOptional()
  @IsNumber()
  choiceNumber: number;
}
export class ExamDto {
  questionGroups: QuestionGroup[];
  @IsString()
  @IsNotEmpty()
  text: string;
}
