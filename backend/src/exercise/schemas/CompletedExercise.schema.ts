import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CompletedExercise extends Document {
  @Prop()
  userId: string;

  @Prop()
  exerciseId: string;

  @Prop()
  start: number;

  @Prop()
  duration: number;

  @Prop({ required: false })
  distances?: string[];

  @Prop({ required: false })
  times?: number[];

  @Prop({ required: false })
  setsReps?: number[];

  @Prop({ required: false })
  setsWeights?: number[];
}

export const CompletedExerciseSchema = SchemaFactory.createForClass(
  CompletedExercise,
);
