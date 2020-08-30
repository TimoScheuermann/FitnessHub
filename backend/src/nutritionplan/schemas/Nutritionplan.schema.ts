import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IRecipe } from 'src/recipe/interfaces/IRecipe';

@Schema()
export class Nutritionplan extends Document {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  time: number;

  @Prop()
  description: string;

  @Prop()
  recipes: IRecipe[];
}

export const NutritionplanSchema = SchemaFactory.createForClass(Nutritionplan);
