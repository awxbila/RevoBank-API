import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors();
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('RevoBank API')
    .setDescription(
      'Banking API for RevoBank - Secure and Scalable Banking System',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name will be used to reference the security scheme
    )
    .addTag('Authentication', 'User registration and login endpoints')
    .addTag('Users', 'User profile management')
    .addTag('Accounts', 'Bank account CRUD operations')
    .addTag(
      'Transactions',
      'Transaction operations (deposit, withdraw, transfer)',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep token after page refresh
    },
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`
🚀
 Application is running on: http://localhost:${port}`);
  console.log(`
📚
 Swagger documentation: http://localhost:${port}/api-docs`);
}
bootstrap();
