import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: '*', // Replace with your Angular application's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1')
  const config = new DocumentBuilder()
  .setTitle('Simple-chat')
  .setDescription('The Simple-chat description')
  .setVersion('1.0')
  .addTag('Simple-chat')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(9999);
}
bootstrap();
