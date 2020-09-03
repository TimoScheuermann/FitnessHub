import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { INutrition } from '../interfaces/INutrition';
import { IRecipeIngredient } from '../interfaces/IRecipeIngredient';

@Schema()
export class Recipe extends Document {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  time: number;

  @Prop({ required: false })
  video?: string;

  @Prop()
  thumbnail: string;

  @Prop()
  ingredients: IRecipeIngredient[];

  @Prop()
  nutrition: INutrition[];

  @Prop()
  category: string[];

  @Prop()
  difficulty: number;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
