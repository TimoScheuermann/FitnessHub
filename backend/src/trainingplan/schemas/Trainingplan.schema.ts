import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Trainingplan extends Document {
  @Prop()
  author: string;

  @Prop({ required: false })
  0?: string;

  @Prop({ required: false })
  1?: string;

  @Prop({ required: false })
  2?: string;

  @Prop({ required: false })
  3?: string;

  @Prop({ required: false })
  4?: string;

  @Prop({ required: false })
  5?: string;

  @Prop({ required: false })
  6?: string;
}

export const TrainingplanSchema = SchemaFactory.createForClass(Trainingplan);
