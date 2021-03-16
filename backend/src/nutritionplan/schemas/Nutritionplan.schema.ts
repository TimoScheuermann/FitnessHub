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
  description: string;

  @Prop()
  categories: string[];

  @Prop({ type: INutritionplanDay })
  monday: INutritionplanDay;

  @Prop({ type: INutritionplanDay })
  tuesday: INutritionplanDay;

  @Prop({ type: INutritionplanDay })
  wednesday: INutritionplanDay;

  @Prop({ type: INutritionplanDay })
  thursday: INutritionplanDay;

  @Prop({ type: INutritionplanDay })
  friday: INutritionplanDay;

  @Prop({ type: INutritionplanDay })
  saturday: INutritionplanDay;

  @Prop({ type: INutritionplanDay })
  sunday: INutritionplanDay;
}

export const NutritionplanSchema = SchemaFactory.createForClass(Nutritionplan);
