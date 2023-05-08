import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppPort } from 'config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({ origin: '*' });
    await app.listen(AppPort);
}
bootstrap();
