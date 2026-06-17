import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AiResponse {
  @Field()
  answer: string;

  @Field(() => ID)
  sessionId: string;
}
