<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# RentCar API

Bu loyiha avtomobil ijarasi uchun REST API hisoblanadi.

## O'rnatish

```bash
npm install
```

## Environment Variables

### 1. .env fayl yarating

Loyiha papkasida `.env` fayl yarating:

```bash
cp env.example .env
```

### 2. .env faylni to'ldiring

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_DATABASE=rentCarDb

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Muhim:** 
- Gmail uchun "App Password" ishlatish kerak. Oddiy parol ishlamaydi.
- `dotenv` paketi `.env` faylni avtomatik o'qiydi
- Agar `.env` fayl yaratmasangiz, `src/config/env.config.ts` dagi default qiymatlar ishlatiladi

## Database

PostgreSQL database yarating:

```sql
CREATE DATABASE "rentCarDb";
```

## Ishga tushirish

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## API Endpoints

### Auth
- `POST /auth/register` - Foydalanuvchi ro'yxatdan o'tish (barcha ma'lumotlar bilan)
- `POST /auth/login` - Tizimga kirish
- `GET /auth/verify-email?token=...` - Email tasdiqlash

### Users
- `GET /users` - Barcha foydalanuvchilar
- `GET /users/:id` - Foydalanuvchi ma'lumoti
- `POST /users` - Yangi foydalanuvchi
- `PATCH /users/:id` - Foydalanuvchi ma'lumotini yangilash
- `DELETE /users/:id` - Foydalanuvchini o'chirish

## Email tasdiqlash tizimi

1. Foydalanuvchi barcha ma'lumotlarini (username, password, email, phoneNumber, firstName, lastName, birthDate, DLN) bilan ro'yxatdan o'tadi
2. Ma'lumotlar JWT token ichiga joylanadi va 24 soat amal qiladi
3. Foydalanuvchining emailiga tasdiqlash linki yuboriladi
4. Link bosilgandan keyin JWT token tekshiriladi va barcha ma'lumotlar databasega saqlanadi
5. Foydalanuvchi yaratiladi va login uchun access token beriladi
6. Faqat tasdiqlangan email bilan tizimga kirish mumkin

**Eslatma:** Auth va User entitylari birlashtirildi, faqat User entity ishlatiladi

## Ro'yxat ma'lumotlari

```json
{
  "username": "johndoe",
  "password": "password123",
  "email": "john@example.com",
  "phoneNumber": "+998901234567",
  "firstName": "John",
  "lastName": "Doe",
  "birthDate": "1990-01-01",
  "DLN": "1234567890"
}
```

## JWT Token tizimi

- **Register token**: 24 soat amal qiladi, barcha ro'yxat ma'lumotlarini o'z ichiga oladi
- **Access token**: Login qilgandan keyin beriladi, foydalanuvchi ma'lumotlarini o'z ichiga oladi
- **Email verification**: JWT token orqali amalga oshiriladi, xavfsiz va samarali

## Configuration

Loyiha `dotenv` va `src/config/env.config.ts` fayllari orqali environment variables ni boshqaradi:

- **`dotenv`** - `.env` faylni avtomatik o'qiydi
- **`env.config.ts`** - barcha config qiymatlarini boshqaradi
- **Database sozlamalari**
- **JWT sozlamalari**  
- **Email sozlamalari**
- **Frontend URL**

## Gmail App Password yaratish

1. Google Account ga kiring
2. Security > 2-Step Verification > App passwords
3. "Mail" ni tanlang va "Generate" bosing
4. 16 xonali parolni `.env` faylda `EMAIL_PASS` ga kiritasiz
