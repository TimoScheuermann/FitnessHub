import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TgChat extends Document {
  @Prop({ required: false })
  userId?: string;

  @Prop()
  telegramChat: number;

  @Prop()
  token: string;
}

export const TgChatSchema = SchemaFactory.createForClass(TgChat);
