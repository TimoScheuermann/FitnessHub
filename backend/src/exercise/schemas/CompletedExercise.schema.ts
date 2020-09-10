import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ISet } from '../interfaces/ICompletedExercise';

@Schema()
export class CompletedExercise extends Document {
  @Prop()
  exercise: string;

  @Prop()
  user: string;

  @Prop()
  start: number;

  @Prop()
  end: number;

  @Prop({ required: false })
  sets?: ISet[];

  @Prop({ required: false })
  distance?: string;
}

export const CompletedExerciseSchema = SchemaFactory.createForClass(
  CompletedExercise,
);
