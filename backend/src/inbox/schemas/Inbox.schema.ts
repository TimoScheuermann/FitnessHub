import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Inbox extends Document {
  @Prop()
  date: number;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop()
  message: string;
}

export const InboxSchema = SchemaFactory.createForClass(Inbox);
