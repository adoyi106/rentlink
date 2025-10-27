import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

export const config : ConfigService = new ConfigService ();

export default () => ({
    appName: config.get<string>('APP_NAME'),
    port: config.get<number>('APP_PORT') || 3000,
    env: config.get<string>('APP_ENV') || "development",
    mongodb_url: config.get<string>('MONGODB_URL'),
    jwt: {
    secret: config.get<string>('JWT_SECRET'),
    expiresIn: config.get<number>('JWT_EXPIRES_IN'),
  },
})