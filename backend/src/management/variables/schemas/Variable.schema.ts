import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Variable extends Document {
  @Prop()
  type: 'muscle' | 'category' | 'custom';

  @Prop()
  title: string;

  @Prop()
  thumbnail: string;
}

export const VariableSchema = SchemaFactory.createForClass(Variable);
