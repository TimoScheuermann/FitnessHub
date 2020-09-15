import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { UpdateRecipeDTO } from './dtos/UpdateRecipe.dto';
import { IRecipe } from './interfaces/IRecipe';
import { LikedRecipe } from './schemas/LikedRecipe.schema';
import { Recipe } from './schemas/Recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private recipeModel: Model<Recipe>,
    @InjectModel(LikedRecipe.name)
    private likedRecipeModel: Model<LikedRecipe>,
    private readonly tgbotService: TgbotService,
  ) {}

  public async getAll(): Promise<IRecipe[]> {
    return this.recipeModel.find().limit(50);
  }

  public async getByAuthor(author: string): Promise<IRecipe[]> {
    return this.recipeModel.find({
      author: author,
    });
  }

  public async getLatest(): Promise<IRecipe[]> {
    return this.recipeModel.find().sort({ updated: -1 }).limit(10);
  }

  public async getBeloved(): Promise<IRecipe[]> {
    const topTen = await this.likedRecipeModel
      .aggregate([{ $unwind: '$recipes' }, { $sortByCount: '$recipes' }])
      .sort({ count: -1 })
      .limit(10);
    return Promise.all(topTen.map((x) => this.getById(x._id)));
  }

  public async getById(id: string): Promise<IRecipe> {
    return this.recipeModel.findById({ _id: id });
  }

  public async getByCategory(category: string): Promise<IRecipe[]> {
    return await this.recipeModel
      .find({
        category: { $all: [category] },
      })
      .limit(50);
  }

  public async addRecipe(
    user: IUser,
    createRecipeDTO: CreateRecipeDTO,
  ): Promise<IRecipe> {
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
    return recipe;
  }

  public async updateRecipe(
    id: string,
    userId: string,
    updateRecipeDTO: UpdateRecipeDTO,
  ): Promise<IRecipe> {
    await this.recipeModel.updateOne(
      { _id: id, author: userId },
      { $set: { ...updateRecipeDTO, updated: new Date().getTime() } },
    );
    return this.getById(id);
  }

  public async deleteRecipe(userId: string, recipeId: string): Promise<void> {
    await this.recipeModel.findOneAndDelete({
      author: userId,
      _id: recipeId,
    });
    await this.likedRecipeModel.updateMany(
      {},
      { $pull: { recipes: recipeId } },
    );
  }

  public async getLiked(userId: string): Promise<IRecipe[]> {
    const likedObject = await this.likedRecipeModel.findOne(
      { user: userId },
      { recipes: 1, _id: 0 },
    );
    if (!likedObject) return [];
    return Promise.all(
      likedObject.recipes.map(async (x) => await this.getById(x)),
    );
  }

  public async addLike(userId: string, recipe: string): Promise<void> {
    await this.likedRecipeModel.updateOne(
      { user: userId },
      { $addToSet: { recipes: recipe } },
      { upsert: true },
    );
  }
  public async removeLike(userId: string, recipe: string): Promise<void> {
    await this.likedRecipeModel.updateOne(
      { user: userId },
      { $pull: { recipes: recipe } },
    );
  }

  public transformName(user: IUser): string {
    return [user.givenName, user.familyName].filter((x) => !!x).join(' ');
  }
}
