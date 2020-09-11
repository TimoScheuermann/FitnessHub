import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { INutritionplanDay } from '../interfaces/INutritionplanDay';

@Schema()
export class Nutritionplan extends Document {
  @Prop()
  author: string;

  @Prop()
  created: number;

  @Prop()
  updated: number;

  @Prop()
  title: string;

  @Prop()
  time: number;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop()
  monday: INutritionplanDay;

  @Prop()
  tuesday: INutritionplanDay;

  @Prop()
  wednesday: INutritionplanDay;

  @Prop()
  thursday: INutritionplanDay;

  @Prop()
  friday: INutritionplanDay;

  @Prop()
  saturday: INutritionplanDay;

  @Prop()
  sunday: INutritionplanDay;
}

export const NutritionplanSchema = SchemaFactory.createForClass(Nutritionplan);
