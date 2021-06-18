import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
