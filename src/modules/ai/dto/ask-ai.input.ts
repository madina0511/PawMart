import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class AskAiInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  question: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  petId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  sessionId?: string;
}
