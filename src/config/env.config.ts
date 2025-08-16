import { config } from 'dotenv';
config();

export const envVariables = {
  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'rentCarDb',
  },

  // JWT
  jwt: {
    secret:
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-change-in-production',
    expiresIn: '24h',
  },

  // Email (Gmail)
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // Frontend URL
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};
