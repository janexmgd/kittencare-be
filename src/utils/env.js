import 'dotenv/config';

const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  APP_PORT: process.env.APP_PORT || 3000,
  APP_NAME: process.env.APP_NAME,
  NODE_ENV: process.env.NODE_ENV,
  SECRET_KEY: process.env.SECRET_KEY,
};
export default env;
