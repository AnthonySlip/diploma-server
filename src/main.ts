import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const port = 5400
  await app.listen(port, () => console.log(`Nest has started on ${port} port`));
}

bootstrap();
