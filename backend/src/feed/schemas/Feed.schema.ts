import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Feed extends Document {
  @Prop()
  timestamp: number;

  @Prop()
  text: string;

  @Prop({ required: false })
  user?: string;

  @Prop({ required: false })
  thumbnail?: string;

  @Prop({ required: false })
  title?: string;

  @Prop({ required: false })
  recipeId?: string;

  @Prop({ required: false })
  exerciseId?: string;

  @Prop({ required: false })
  achievementTitle?: string;

  @Prop({ required: false })
  hot?: string[];

  @Prop({ required: false })
  like?: string[];

  @Prop({ required: false })
  strong?: string[];

  @Prop({ required: false })
  thumbsup?: string[];

  @Prop({ required: false })
  monkey?: string[];
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
