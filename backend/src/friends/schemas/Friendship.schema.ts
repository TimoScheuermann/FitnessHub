import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Friendship extends Document {
  @Prop()
  accepted: boolean;

  @Prop()
  invitee: string;

  @Prop()
  target: string;

  @Prop()
  since: number;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
