import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop()
  type: string;

  @Prop()
  date: number;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop()
  read: boolean;

  @Prop()
  content: number[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
