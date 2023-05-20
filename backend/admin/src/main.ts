/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: '*',
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(process.env.PORT || 3000);
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
}
bootstrap();
