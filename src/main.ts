import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';


const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false
  }
  return compression.filter(req, res)
}

async function bootstrap() {

  const app: INestApplication = await NestFactory.create(AppModule);

  const port = 5400

  app.use(
    compression({
      filter: shouldCompress,
      threshold: 0
    })
  )

  app.use(cookieParser())
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL
    })
  )
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(port, () => console.log(`Nest has started on ${port} port`));
}

bootstrap();
