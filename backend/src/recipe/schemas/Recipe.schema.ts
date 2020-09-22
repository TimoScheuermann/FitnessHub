import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { INutrition } from '../interfaces/INutrition';
import { IRecipeIngredient } from '../interfaces/IRecipeIngredient';

@Schema()
export class Recipe extends Document {
  @Prop()
  author: string;

  @Prop()
  created: number;

  @Prop()
  updated: number;

  @Prop()
  title: string;

  @Prop()
  category: string[];

  @Prop()
  time: number;

  @Prop()
  difficulty: number;

  @Prop()
  ingredients: IRecipeIngredient[];

  @Prop()
  nutrition: INutrition[];

  @Prop()
  thumbnail: string;

  @Prop()
  steps: string[];

  @Prop()
  video?: string;

  @Prop()
  description?: string;

  @Prop({ required: false })
  source?: string;
}
export const RecipeSchema = SchemaFactory.createForClass(Recipe);
