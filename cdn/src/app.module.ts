import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [
    CacheModule.register({
      ttl: 30,
      max: 100,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
