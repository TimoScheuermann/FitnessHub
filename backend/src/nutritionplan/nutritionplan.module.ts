import { Module } from '@nestjs/common';
import { NutritionplanController } from './nutritionplan.controller';

@Module({
  controllers: [NutritionplanController]
})
export class NutritionplanModule {}
