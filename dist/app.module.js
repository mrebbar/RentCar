"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const env_config_1 = require("./config/env.config");
const jwt_1 = require("@nestjs/jwt");
const cars_module_1 = require("./cars/cars.module");
const order_module_1 = require("./order/order.module");
const category_module_1 = require("./category/category.module");
const review_module_1 = require("./review/review.module");
const profile_module_1 = require("./profile/profile.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [() => env_config_1.envVariables],
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: env_config_1.envVariables.database.host,
                port: env_config_1.envVariables.database.port,
                username: env_config_1.envVariables.database.username,
                password: env_config_1.envVariables.database.password,
                database: env_config_1.envVariables.database.database,
                autoLoadEntities: true,
                synchronize: true,
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: env_config_1.envVariables.jwt.secret,
                signOptions: { expiresIn: env_config_1.envVariables.jwt.expiresIn },
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            cars_module_1.CarsModule,
            order_module_1.OrderModule,
            category_module_1.CategoryModule,
            review_module_1.ReviewModule,
            profile_module_1.ProfileModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map