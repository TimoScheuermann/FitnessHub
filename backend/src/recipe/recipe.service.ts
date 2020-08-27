import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe } from './schemas/Recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private recipeModel: Model<Recipe>,
  ) {}

  async getRecipeById(id: string): Promise<Recipe> {
    return this.recipeModel.findOne({
      _id: id,
    });
  }
}
