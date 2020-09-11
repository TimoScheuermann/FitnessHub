import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LikedRecipe extends Document {
  @Prop()
  user: string;

  @Prop()
  recipes: string[];
}
export const LikedRecipeSchema = SchemaFactory.createForClass(LikedRecipe);
