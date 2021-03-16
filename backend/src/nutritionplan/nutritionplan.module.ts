import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Variable,
  VariableSchema,
} from 'src/management/variables/schemas/Variable.schema';
import { Recipe, RecipeSchema } from 'src/recipe/schemas/Recipe.schema';
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
      { name: Variable.name, schema: VariableSchema },
      { name: Recipe.name, schema: RecipeSchema },
    ]),
    TgbotModule,
  ],
  controllers: [NutritionplanController],
  providers: [NutritionplanService],
})
export class NutritionplanModule {}
