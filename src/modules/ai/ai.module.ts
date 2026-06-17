import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiService } from './ai.service';
import { AiResolver } from './ai.resolver';
import { ChatSession, ChatSessionSchema } from './chat-session.schema';
import { AuthModule } from '../auth/auth.module';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatSession.name, schema: ChatSessionSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    AuthModule,
  ],
  providers: [AiService, AiResolver],
  exports: [AiService],
})
export class AiModule {}
