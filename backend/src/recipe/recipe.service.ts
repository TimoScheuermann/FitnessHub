import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { UpdateRecipeDTO } from './dtos/UpdateRecipe.dto';
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
    createRecipeDTO: CreateRecipeDTO,
  ): Promise<void> {
    if (
      [
        createRecipeDTO.title,
        createRecipeDTO.category,
        createRecipeDTO.thumbnail,
        createRecipeDTO.steps,
      ].filter((x) => x.length === 0).length > 0
    ) {
      return;
    }
    if (
      !createRecipeDTO.time ||
      createRecipeDTO.time <= 0 ||
      !createRecipeDTO.nutrition ||
      !createRecipeDTO.ingredients ||
      !createRecipeDTO.difficulty
    ) {
      return;
    }
    const recipe = await this.recipeModel.create({
      ...createRecipeDTO,
      created: new Date().getTime(),
      updated: new Date().getTime(),
      author: user._id,
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

  public async updateRecipe(
    id: string,
    userId: string,
    updateRecipeDTO: UpdateRecipeDTO,
  ): Promise<void> {
    await this.recipeModel.updateOne(
      { _id: id, author: userId },
      { $set: { updateRecipeDTO, updated: new Date().getTime() } },
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
