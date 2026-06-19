import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3001', // frontend port
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🐾 PawMart backend running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
