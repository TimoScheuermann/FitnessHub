import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AvailableSetting } from '../setting.service';

@Schema()
export class Setting extends Document {
  @Prop()
  user: string;

  @Prop({ required: false })
  disabled?: AvailableSetting[];
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
