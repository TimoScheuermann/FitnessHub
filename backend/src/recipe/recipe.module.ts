import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TgbotModule } from 'src/tgbot/tgbot.module';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { Recipe, RecipeSchema } from './schemas/Recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    TgbotModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
