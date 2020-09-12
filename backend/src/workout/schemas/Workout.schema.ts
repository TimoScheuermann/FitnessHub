import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Workout extends Document {
  @Prop()
  author: string;

  @Prop()
  title: string;

  @Prop()
  exercises: string[];

  @Prop()
  updated: number;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);
