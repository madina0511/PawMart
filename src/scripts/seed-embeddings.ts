import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Model } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productModel = app.get(getModelToken('Product'));

  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small',
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: 'https://openrouter.ai/api/v1',
    },
  });

  const products = await productModel.find({ embedding: { $exists: false } });
  console.log(`Found ${products.length} products without embeddings`);

  for (const product of products) {
    const text = `${product.name} ${product.description} ${product.category} ${product.petType}`;
    const embedding = await embeddings.embedQuery(text);
    await productModel.updateOne({ _id: product._id }, { $set: { embedding } });
    console.log(`✅ Embedded: ${product.name}`);
  }

  console.log('Done!');
  await app.close();
}

bootstrap();
