"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
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
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token here (Bearer will be added automatically)',
    }, 'JWT-auth')
        .addTag('Authentication', 'Foydalanuvchi autentifikatsiyasi')
        .addTag('Cars', 'Avtomobillar boshqaruvi')
        .addTag('Orders', 'Buyurtmalar boshqaruvi')
        .addTag('Users Management', 'Foydalanuvchilar boshqaruvi')
        .addTag('Reviews', 'Sharhlar boshqaruvi')
        .addTag('Categories', 'Kategoriyalar boshqaruvi')
        .addTag('Profile', 'Foydalanuvchi profili')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
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
//# sourceMappingURL=main.js.map