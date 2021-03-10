import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedModule } from 'src/feed/feed.module';
import {
  Variable,
  VariableSchema,
} from 'src/management/variables/schemas/Variable.schema';
import { TgbotModule } from 'src/tgbot/tgbot.module';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { LikedRecipe, LikedRecipeSchema } from './schemas/LikedRecipe.schema';
import { Recipe, RecipeSchema } from './schemas/Recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: LikedRecipe.name, schema: LikedRecipeSchema },
      { name: Variable.name, schema: VariableSchema },
    ]),
    TgbotModule,
    FeedModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
