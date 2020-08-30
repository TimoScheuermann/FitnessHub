import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { IRecipe } from './interfaces/IRecipe';
import { Recipe } from './schemas/Recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private recipeModel: Model<Recipe>,
  ) {}

  public async getAllRecipesOf(userID: string): Promise<Recipe[]> {
    return this.recipeModel.find({
      author: userID,
    });
  }

  public async getAllRecipes(): Promise<IRecipe[]> {
    return this.recipeModel.find().limit(50);
  }

  public async addRecipe(userID: string, createRecipe: CreateRecipeDTO) {
    await this.recipeModel.create({
      author: userID,
      ...createRecipe,
    });
  }
}
