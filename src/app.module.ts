import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { envVariables } from './config/env.config';
import { JwtModule } from '@nestjs/jwt';
import { CarsModule } from './cars/cars.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envVariables],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envVariables.database.host,
      port: envVariables.database.port,
      username: envVariables.database.username,
      password: envVariables.database.password,
      database: envVariables.database.database,
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: envVariables.jwt.secret,
      signOptions: { expiresIn: envVariables.jwt.expiresIn },
    }),
    UsersModule,
    AuthModule,
    CarsModule,
    OrderModule,
    CategoryModule,
    ReviewModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
