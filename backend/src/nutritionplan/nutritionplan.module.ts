import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NutritionplanController } from './nutritionplan.controller';
import { NutritionplanService } from './nutritionplan.service';
import {
  Nutritionplan,
  NutritionplanSchema,
} from './schemas/Nutritionplan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Nutritionplan.name, schema: NutritionplanSchema },
    ]),
  ],
  controllers: [NutritionplanController],
  providers: [NutritionplanService],
})
export class NutritionplanModule {}
