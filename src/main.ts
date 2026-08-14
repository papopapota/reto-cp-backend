import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from './common/infrastructure/filters';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(
    new DomainExceptionFilter(),
  );
  const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('Especificación y documentación de endpoints')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
