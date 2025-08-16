import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS sozlash (credentials yuborish uchun origin aniqlash kerak)
  app.enableCors({
    origin: '*', // productionda aniq frontend domain qo‘yish tavsiya qilinadi
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger konfiguratsiyasi
  const config = new DocumentBuilder()
    .setTitle('RentCar API')
    .setDescription(`
# RentCar API Documentation

Bu API RentCar loyihasi uchun to'liq CRUD operatsiyalarini taqdim etadi.

## Asosiy funksiyalar:
- Authentication
- Cars Management
- Orders Management
- Users Management
- Reviews
- Categories
- Profile

## Foydalanuvchi rollari:
- User
- Lessor
- Admin
- SuperAdmin

## Authentication:
API Bearer token orqali ishlaydi. Avval /auth/login endpoint orqali token olishingiz kerak.
**Token format:** Bearer YOUR_JWT_TOKEN
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token here (Bearer will be added automatically)',
      },
      'JWT-auth', // swagger reference name
    )
    .addTag('Authentication', 'Foydalanuvchi autentifikatsiyasi')
    .addTag('Cars', 'Avtomobillar boshqaruvi')
    .addTag('Orders', 'Buyurtmalar boshqaruvi')
    .addTag('Users Management', 'Foydalanuvchilar boshqaruvi')
    .addTag('Reviews', 'Sharhlar boshqaruvi')
    .addTag('Categories', 'Kategoriyalar boshqaruvi')
    .addTag('Profile', 'Foydalanuvchi profili')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Authorize token saqlanadi
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'RentCar API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; font-size: 36px; }
      .swagger-ui .info .description { font-size: 16px; line-height: 1.6; }
      .swagger-ui .auth-wrapper { margin: 20px 0; }
      .swagger-ui .auth-container { padding: 10px; }
    `,
  });

  const port = process.env.PORT ?? 3009;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();