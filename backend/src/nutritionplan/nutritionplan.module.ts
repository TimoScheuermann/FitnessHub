import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TgbotModule } from 'src/tgbot/tgbot.module';
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
    TgbotModule,
  ],
  controllers: [NutritionplanController],
  providers: [NutritionplanService],
})
export class NutritionplanModule {}
