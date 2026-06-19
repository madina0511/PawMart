import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatSession, ChatSessionDocument } from './chat-session.schema';
import { Product } from '../products/schemas/product.schema';
import { getErrorMessage } from '../../common/utils/error.util';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import mongoose from 'mongoose';
import { Pet } from '../pets/pet.schema';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private llm: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;

  constructor(
    @InjectModel(ChatSession.name)
    private chatSessionModel: Model<ChatSessionDocument>,
    @InjectModel(Product.name) private productModel: Model<any>,
    @InjectModel(Pet.name) private petModel: Model<any>, // ✅
  ) {
    this.llm = new ChatOpenAI({
      modelName: 'openai/gpt-4o-mini',
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
      },
      temperature: 0.7,
    });

    this.embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-small',
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
      },
    });
  }

  async askAI(
    userId: string,
    question: string,
    petId?: string,
    sessionId?: string,
  ): Promise<{ answer: string; sessionId: string }> {
    try {
      // 1. Session topish yoki yangi yaratish
      let session = sessionId
        ? await this.chatSessionModel.findById(sessionId)
        : null;

      if (!session) {
        session = new this.chatSessionModel({
          userId: userId === 'guest' ? null : new Types.ObjectId(userId),
          petId: petId ? new Types.ObjectId(petId) : undefined,
          messages: [],
        });
      }

      // 2. Chat history
      const historyText = session.messages
        .slice(-6)
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');

      // 3. Vector search — relevant products
      // 3. Vector search — relevant products
      let productContext = '';
      try {
        const mongoClient = this.productModel.db.getClient();
        const collection = mongoClient.db('Pawmart').collection('products');

        const vectorStore = new MongoDBAtlasVectorSearch(this.embeddings, {
          collection,
          indexName: 'product_vector_index',
          textKey: 'description',
          embeddingKey: 'embedding',
        });
        const relevantDocs = await vectorStore.similaritySearch(question, 3);
        productContext = relevantDocs
          .map((d) => `Product: ${d.metadata.name || ''} - ${d.pageContent}`)
          .join('\n');
        this.logger.log(`Vector search found: ${relevantDocs.length} docs`);
      } catch (e) {
        this.logger.warn(`Vector search failed: ${getErrorMessage(e)}`);
      }

      // ✅ 4. Pet context
      let petContext = '';
      try {
        const availablePets = await this.petModel
          .find({ status: 'AVAILABLE' })
          .select('name species breed age price description vaccinated color')
          .limit(10)
          .lean();

        petContext = availablePets
          .map(
            (p) =>
              `Pet: ${p.name} | Species: ${p.species} | Breed: ${p.breed || 'Unknown'} | Age: ${p.age || '?'} years | Price: ₩${p.price?.toLocaleString()} | Vaccinated: ${p.vaccinated ? 'Yes' : 'No'}`,
          )
          .join('\n');
        this.logger.log(`Pet context: ${availablePets.length} pets found`);
      } catch (e) {
        this.logger.warn(`Pet context failed: ${getErrorMessage(e)}`);
      }
      // 4. Prompt
      const prompt = PromptTemplate.fromTemplate(`
You are PawMart AI assistant - a friendly, knowledgeable assistant for PawMart pet shop.

You can help with:
1. 🐾 Pet health & care advice (nutrition, exercise, grooming, common illnesses)
2. 🛍️ Product recommendations based on pet type, age, and needs
3. 🐶 Pet adoption recommendations from our available pets
4. 🏪 PawMart store info:
   - Shipping: 2-3 business days, free over 50,000 KRW
   - Returns: 7 days return policy
   - Payment: Toss Payments (card, kakao pay, naver pay)
   - Customer service: pawmart@support.com
5. 🏥 General veterinary advice (always recommend vet for serious issues)
6. Do not use markdown formatting, line breaks or special characters in your response. Write in plain text only.


Product catalog:
{productContext}

Available pets for adoption:
{petContext} 
Chat history:
{history}

User question: {question}

Rules:
-Answer in the same language as the user's question. 
If the question is in English, answer in English.
If the question is in Korean (한국어), answer in Korean.
If the question is in Uzbek, answer in Uzbek.
- Be friendly and empathetic
- For serious health issues, always recommend visiting a vet
- Keep answers concise but helpful
`);

      // 5. Chain
      // 5. Chain — o'zgartiring
      const chain = prompt.pipe(this.llm as any).pipe(new StringOutputParser());

      const answer = await chain.invoke({
        productContext,
        history: historyText,
        question,
        petContext,
      });
      this.logger.log(`Product context: ${productContext}`);
      // 6. Messages saqlash
      session.messages.push(
        { role: 'user', content: question, timestamp: new Date() },
        { role: 'assistant', content: answer, timestamp: new Date() },
      );
      await session.save();

      return { answer, sessionId: session._id.toString() };
    } catch (error) {
      this.logger.error(`askAI: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getChatHistory(sessionId: string): Promise<ChatSession> {
    try {
      const session = await this.chatSessionModel.findById(sessionId);
      if (!session) throw new Error('Session not found');
      return session;
    } catch (error) {
      this.logger.error(`getChatHistory: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUserSessions(userId: string): Promise<ChatSession[]> {
    try {
      return await this.chatSessionModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ updatedAt: -1 })
        .limit(10);
    } catch (error) {
      this.logger.error(`getUserSessions: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}
