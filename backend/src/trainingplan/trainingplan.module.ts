import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Trainingplan,
  TrainingplanSchema,
} from './schemas/Trainingplan.schema';
import { TrainingplanController } from './trainingplan.controller';
import { TrainingplanService } from './trainingplan.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trainingplan.name, schema: TrainingplanSchema },
    ]),
  ],
  providers: [TrainingplanService],
  controllers: [TrainingplanController],
  exports: [TrainingplanService],
})
export class TrainingplanModule {}
