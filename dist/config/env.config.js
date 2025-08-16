"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVariables = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.envVariables = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5433'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_DATABASE || 'rentCarDb',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-change-in-production',
        expiresIn: '24h',
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
};
//# sourceMappingURL=env.config.js.map