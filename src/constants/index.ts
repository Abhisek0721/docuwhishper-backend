import * as dotenv from 'dotenv';
dotenv.config();

export const envConstant = {
  PORT: Number(process.env.PORT) || 3000,

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'm9NBTSZWT1OcNBRY',

  BASE_URL: process.env.BASE_URL || 'http://localhost:3001',

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  GOOGLE_LOGIN_REDIRECT_ENDPOINT:
    process.env.GOOGLE_LOGIN_REDIRECT_ENDPOINT || '/api/v1/auth/callback',

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',

  PINECONE_BASE_URL: process.env.PINECONE_BASE_URL || '',

  N8N_CHATBOT_WEBHOOK_URL: process.env.N8N_CHATBOT_WEBHOOK_URL || '',
};
