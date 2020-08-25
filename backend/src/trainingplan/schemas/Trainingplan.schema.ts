import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ITrainingUnit } from '../interfaces/ITrainingUnit';

@Schema()
export class Trainingplan extends Document {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  category: string;

  @Prop()
  time: number;

  @Prop()
  units: ITrainingUnit[];
}

export const TrainingplanSchema = SchemaFactory.createForClass(Trainingplan);
