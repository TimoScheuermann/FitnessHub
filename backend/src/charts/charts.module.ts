import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompletedExercise,
  CompletedExerciseSchema,
} from 'src/exercise/schemas/CompletedExercise.schema';
import { FriendsModule } from 'src/friends/friends.module';
import { SettingModule } from 'src/setting/setting.module';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompletedExercise.name, schema: CompletedExerciseSchema },
    ]),
    SettingModule,
    FriendsModule,
  ],
  controllers: [ChartsController],
  providers: [ChartsService],
})
export class ChartsModule {}
