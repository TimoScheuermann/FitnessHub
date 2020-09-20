import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsModule } from 'src/friends/friends.module';
import { SettingModule } from 'src/setting/setting.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { Health, HealthSchema } from './schemas/Health.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Health.name, schema: HealthSchema }]),
    SettingModule,
    FriendsModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
