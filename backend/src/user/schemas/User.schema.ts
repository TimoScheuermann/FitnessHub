import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Provider } from 'src/auth/auth.service';

@Schema()
export class User extends Document {
  @Prop()
  givenName: string;

  @Prop()
  familyName: string;

  @Prop()
  avatar: string;

  @Prop()
  provider: Provider;

  @Prop()
  thirdPartyId: string;

  @Prop()
  group: string;

  @Prop()
  date: number;

  @Prop({ required: false })
  suspendedBy?: string;

  @Prop({ required: false })
  suspended?: number;

  @Prop({ required: false })
  telegramChat?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
