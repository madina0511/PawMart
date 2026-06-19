import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AskAiInput } from './dto/ask-ai.input';
import { AiResponse } from './dto/ai-response.dto';
import { ChatSession } from './chat-session.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver()
export class AiResolver {
  private readonly logger = new Logger(AiResolver.name);

  constructor(private readonly aiService: AiService) {}

  // ✅ Public — login shart emas
  @Mutation(() => AiResponse)
  async askAI(@Args('askAiInput') askAiInput: AskAiInput): Promise<AiResponse> {
    this.logger.log(`askAI called`);
    return this.aiService.askAI(
      'guest',
      askAiInput.question,
      askAiInput.petId,
      askAiInput.sessionId,
    );
  }

  @Query(() => ChatSession)
  async chatHistory(
    @Args('sessionId', { type: () => ID }) sessionId: string,
  ): Promise<ChatSession> {
    return this.aiService.getChatHistory(sessionId);
  }

  // ✅ Login kerak
  @UseGuards(JwtAuthGuard)
  @Query(() => [ChatSession])
  async mySessions(@CurrentUser() user: any): Promise<ChatSession[]> {
    return this.aiService.getUserSessions(user._id.toString());
  }
}
