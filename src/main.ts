import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { configureSwagger } from './libs';
import helmet from 'helmet';
import configuration from './libs/configuration';


const config = configuration();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true});

  app.setGlobalPrefix('api/v1');
  
  app.enableCors({
    origin: '*',
    methods: 'POST, GET, OPTIONS, DELETE, PATCH',
    credentials: true,
    allowedHeaders:
      'Content-Type, Authorization, X-Requested-With, token, X-Forwarded-For, x-hmac-signature, X-Hmac-Signature, X-Request-Medium',
  });

app.use(helmet());
  configureSwagger(app);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', ()=>{
     console.warn(`
    -----------------------------------------------------------
    lms-onboarding Application Started!
    API Docs: http://localhost:${config.port ?? 3000}/documentation
    -----------------------------------------------------------
  `);
  });
}
bootstrap();
