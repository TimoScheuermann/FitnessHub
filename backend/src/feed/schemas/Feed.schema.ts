import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Feed extends Document {
  @Prop()
  timestamp: number;

  @Prop()
  text: string;

  @Prop()
  user?: string;

  @Prop()
  thumbnail?: string;

  @Prop()
  title?: string;

  @Prop()
  recipeId?: string;

  @Prop()
  exerciseId?: string;

  @Prop()
  hot?: string[];

  @Prop()
  like?: string[];

  @Prop()
  strong?: string[];

  @Prop()
  thumbsup?: string[];

  @Prop()
  monkey?: string[];
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
