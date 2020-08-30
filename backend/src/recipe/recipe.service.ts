import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INutrition } from './interfaces/INutrition';
import { IRecipeIngredient } from './interfaces/IRecipeIngredient';
import { Recipe } from './schemas/Recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private recipeModel: Model<Recipe>,
  ) {}

  public async getRecipeById(id: string): Promise<Recipe> {
    return this.recipeModel.findOne({
      _id: id,
    });
  }

  public async addRecipe(
    title: string,
    userID: string,
    time: number,
    category: string,
    ingredients: IRecipeIngredient[],
    nutrition: INutrition[],
    image: string,
    video: string,
  ) {
    await this.recipeModel.create({
      title: title,
      author: userID,
      time: time,
      category: category,
      ingredients: ingredients,
      nutrition: nutrition,
      image: image,
      video: video,
    });
  }
}
