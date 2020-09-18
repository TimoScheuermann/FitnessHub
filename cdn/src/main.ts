import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { NestApplication, NestFactory } from '@nestjs/core';
import * as express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

const KEY_PATH = '/etc/letsencrypt/live/api.timos.design/';

(async () => {
  const httpsOptions: HttpsOptions = {};
  let app: NestApplication;
  try {
    httpsOptions.cert = readFileSync(KEY_PATH + 'fullchain.pem');
    httpsOptions.key = readFileSync(KEY_PATH + 'privkey.pem');
    app = await NestFactory.create(AppModule, { httpsOptions, cors: true });
  } catch (error) {
    app = await NestFactory.create(AppModule, { cors: true });
  }

  app.use(express.static(join(process.cwd(), 'public')));

  await app.listen(4000);
})();
