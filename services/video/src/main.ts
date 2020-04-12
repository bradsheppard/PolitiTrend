import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import microserviceConfig from './config/config.microservice';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({transform: true, skipMissingProperties: true}));
    app.connectMicroservice(microserviceConfig);
    await app.startAllMicroservicesAsync();
    await app.listen(3000);
}

bootstrap();
