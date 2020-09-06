import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdateExerciseDTO } from '../dtos/UpdateExercise.dto';

@Schema()
export class Exercise extends Document {
  @Prop()
  author: string;

  @Prop()
  reviewed: boolean;

  @Prop()
  reviewedBy: string;

  @Prop()
  created: number;

  @Prop()
  updated: number;

  @Prop()
  title: string;

  @Prop()
  affectedMuscles: string[];

  @Prop()
  thumbnail: string;

  @Prop({ required: false })
  explanatoryVideo?: string;

  @Prop()
  difficulty: number;

  @Prop()
  warnings: string[];

  @Prop()
  steps: string[];

  @Prop({ required: false })
  editedData?: UpdateExerciseDTO;

  @Prop({ required: false })
  time?: number;

  @Prop({ required: false })
  distance?: string;

  @Prop({ required: false })
  sets?: string;

  @Prop({ required: false })
  reps?: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
