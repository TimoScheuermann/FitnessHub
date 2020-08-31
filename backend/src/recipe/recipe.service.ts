import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { IRecipe } from './interfaces/IRecipe';
import { Recipe } from './schemas/Recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private recipeModel: Model<Recipe>,
    private readonly tgbotService: TgbotService,
  ) {}

  public async getAllRecipesOf(userID: string): Promise<Recipe[]> {
    return this.recipeModel.find({
      author: userID,
    });
  }

  public async getAllRecipes(): Promise<IRecipe[]> {
    return this.recipeModel.find().limit(50);
  }

  public async addRecipe(
    user: IUser,
    createRecipe: CreateRecipeDTO,
  ): Promise<void> {
    const recipe = await this.recipeModel.create({
      author: user._id,
      ...createRecipe,
    });
    this.tgbotService.sendMessage(
      user.givenName +
        ' ' +
        user.familyName +
        ' hat ein neues Rezept https://api.timos.design:3000/recipe/' +
        recipe._id +
        ' hinzugefügt.',
    );
  }

  public async deleteRecipe(userId: string, recipeId: string): Promise<void> {
    await this.recipeModel.findOneAndDelete({
      author: userId,
      _id: recipeId,
    });
  }

  public async getRecipeById(recipeId: string): Promise<IRecipe> {
    return await this.recipeModel.findById({
      _id: recipeId,
    });
  }
}
