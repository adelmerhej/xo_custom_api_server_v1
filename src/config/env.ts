import dotenv from 'dotenv';

dotenv.config();

export const AUTH_SECRET = process.env.AUTH_SECRET;

export const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS;
export const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX;
export const PASSWORD_LENGTH = process.env.PASSWORD_LENGTH;
export const ADMIN_INVITE_TOKEN = process.env.ADMIN_INVITE_TOKEN;

export const MONGODB_URI = process.env.MONGODB_URI;

export const PORT = process.env.PORT || 8999;
export const NODE_ENV = process.env.NODE_ENV;

export const SESSION_EXPIRES = process.env.SESSION_EXPIRES;
export const SESSION_UPDATE_AGE = process.env.SESSION_UPDATE_AGE;
export const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS;
