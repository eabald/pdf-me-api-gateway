import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { createClient } from 'redis';
import * as createRedisStore from 'connect-redis';
import * as passport from 'passport';
import rawBodyMiddleware from './utils/middleware/rawBody.middleware';
import { Config } from '@eabald/pdf-me-shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(rawBodyMiddleware());

  app.use(cookieParser());
  const configService: ConfigService<Config> = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(configService.get('PORT'));
}
bootstrap();
