import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DebugExceptionFilter } from './debug-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new DebugExceptionFilter());

  // Global validation pipe — strips unknown fields, validates DTOs
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }),
  );

  // CORS — allow all origins dynamically so the widget works on any client website
  app.enableCors({
    origin: (origin, callback) => {
      // Always allow, mirroring the requested origin
      callback(null, true);
    },
    credentials: true,
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  console.log(`🚀 FlowBot API running on port ${port}`);
}

bootstrap();
