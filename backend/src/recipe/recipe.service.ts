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
    if (
      [
        createRecipe.category,
        createRecipe.title,
        createRecipe.thumbnail,
      ].filter((x) => x.length === 0).length > 0
    ) {
      return;
    }
    if (!createRecipe.time || createRecipe.time <= 0) {
      return;
    }
    const recipe = await this.recipeModel.create({
      author: user._id,
      ...createRecipe,
    });

    const url = 'https://api.timos.design:3000/recipe/' + recipe._id;
    this.tgbotService.sendURLMessage(
      `<b>${this.transformName(
        user,
      )}</b> hat ein neues <a href='${url}'>Rezept</a> hinzugefügt`,
      'Rezept online anschauen',
      url,
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

  public transformName(user: IUser): string {
    return [user.givenName, user.familyName].filter((x) => !!x).join(' ');
  }
}
