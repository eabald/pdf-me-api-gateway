import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { validate } from './validators/env.validation';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      envFilePath: '.env.dev',
      validationOptions: {
        allowUnknown: false,
      },
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'pdf_me_user',
      password: 'secret',
      database: 'pdf_me',
      entities: [],
      synchronize: false,
      debug: false,
      logging: true,
      logger: 'advanced-console',
    }),
    UsersModule,
    AuthModule,
    TerminusModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
