import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type ChatSessionDocument = ChatSession & Document;

@ObjectType()
export class ChatMessage {
  @Field()
  role: string; // 'user' | 'assistant'

  @Field()
  content: string;

  @Field()
  timestamp: Date;
}

@Schema({ timestamps: true })
@ObjectType()
export class ChatSession {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => ID)
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet' })
  @Field(() => ID, { nullable: true })
  petId?: Types.ObjectId;

  @Prop({
    type: [{ role: String, content: String, timestamp: Date }],
    default: [],
  })
  @Field(() => [ChatMessage])
  messages: ChatMessage[];
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
