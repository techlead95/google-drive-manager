import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Google Drive Management API')
    .setDescription('API for managing Google Drive files')
    .setVersion('1.0')
    .addTag('google-drive')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    allowedHeaders: 'Authorization, Content-Type',
  });

  await app.listen(5000);
}
bootstrap();
