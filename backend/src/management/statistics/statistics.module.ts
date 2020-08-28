import { Module } from '@nestjs/common';
import { FriendsModule } from 'src/friends/friends.module';
import { UserModule } from 'src/user/user.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [UserModule, FriendsModule],
})
export class StatisticsModule {}
