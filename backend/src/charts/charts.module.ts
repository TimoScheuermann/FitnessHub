import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompletedExercise,
  CompletedExerciseSchema,
} from 'src/exercise/schemas/CompletedExercise.schema';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompletedExercise.name, schema: CompletedExerciseSchema },
    ]),
  ],
  controllers: [ChartsController],
  providers: [ChartsService],
})
export class ChartsModule {}
