import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HealthType } from '../health.service';

@Schema()
export class Health extends Document {
  @Prop()
  type: HealthType;

  @Prop()
  date: number;

  @Prop()
  value: number;

  @Prop()
  user: string;
}

export const HealthSchema = SchemaFactory.createForClass(Health);
