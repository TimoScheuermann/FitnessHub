import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Provider } from 'src/auth/auth.service';
import { IUserInfo } from '../interfaces/IUserInfo';

@Schema({
  toJSON: {
    transform: (_doc: User, ret: User): IUserInfo => {
      return {
        _id: ret._id,
        avatar: ret.avatar,
        username: [ret.givenName, ret.familyName].filter((x) => !!x).join(' '),
      };
    },
  },
})
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
}

export const UserSchema = SchemaFactory.createForClass(User);
