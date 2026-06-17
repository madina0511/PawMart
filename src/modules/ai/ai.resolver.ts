import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AskAiInput } from './dto/ask-ai.input';
import { AiResponse } from './dto/ai-response.dto';
import { ChatSession } from './chat-session.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver()
@UseGuards(JwtAuthGuard)
export class AiResolver {
  private readonly logger = new Logger(AiResolver.name);

  constructor(private readonly aiService: AiService) {}

  @Mutation(() => AiResponse)
  async askAI(
    @CurrentUser() user: any,
    @Args('askAiInput') askAiInput: AskAiInput,
  ): Promise<AiResponse> {
    this.logger.log(`askAI called by user: ${user._id}`);
    return this.aiService.askAI(
      user._id.toString(),
      askAiInput.question,
      askAiInput.petId,
      askAiInput.sessionId,
    );
  }

  @Query(() => ChatSession)
  async chatHistory(
    @Args('sessionId', { type: () => ID }) sessionId: string,
  ): Promise<ChatSession> {
    this.logger.log(`chatHistory called: ${sessionId}`);
    return this.aiService.getChatHistory(sessionId);
  }

  @Query(() => [ChatSession])
  async mySessions(@CurrentUser() user: any): Promise<ChatSession[]> {
    this.logger.log(`mySessions called by user: ${user._id}`);
    return this.aiService.getUserSessions(user._id.toString());
  }
}
