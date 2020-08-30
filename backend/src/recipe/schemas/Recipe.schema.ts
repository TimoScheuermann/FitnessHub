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

  @Prop({
    required: false,
    default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  video: string;

  @Prop()
  image: string;

  @Prop()
  ingredients: IRecipeIngredient[];

  @Prop()
  nutrition: INutrition[];

  @Prop()
  category: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
