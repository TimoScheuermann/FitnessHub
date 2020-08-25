import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { NestApplication, NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';

const KEY_PATH = '/etc/letsencrypt/live/api.timos.design/';

async function bootstrap() {
  const httpsOptions: HttpsOptions = {};
  let app: NestApplication;
  try {
    httpsOptions.cert = readFileSync(KEY_PATH + 'fullchain.pem');
    httpsOptions.key = readFileSync(KEY_PATH + 'privkey.pem');
    app = await NestFactory.create(AppModule, { httpsOptions, cors: true });
  } catch (error) {
    app = await NestFactory.create(AppModule, { cors: true });
  }
  await app.listen(3000);
}

bootstrap();
