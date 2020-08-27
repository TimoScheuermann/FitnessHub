import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { INutritionDish } from '../interfaces/INutritionDish';

@Schema()
export class Nutritionplan extends Document {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  category: string;

  @Prop()
  time: number;

  @Prop()
  dishes: INutritionDish[];
}

export const NutritionplanSchema = SchemaFactory.createForClass(Nutritionplan);
