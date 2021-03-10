import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { FeedService } from 'src/feed/feed.service';
import { Variable } from 'src/management/variables/schemas/Variable.schema';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { IRecipe } from './interfaces/IRecipe';
import { RecipeFormValidator } from './RecipeFormValidator';
import { LikedRecipe } from './schemas/LikedRecipe.schema';
import { Recipe } from './schemas/Recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name)
    private recipeModel: Model<Recipe>,
    @InjectModel(LikedRecipe.name)
    private likedRecipeModel: Model<LikedRecipe>,
    @InjectModel(Variable.name)
    private variableModel: Model<Variable>,
    private readonly tgbotService: TgbotService,
    private readonly feedService: FeedService,
  ) {}

  public async getAll(): Promise<IRecipe[]> {
    return this.recipeModel.find().limit(50);
  }

  public async getById(id: string): Promise<IRecipe | null> {
    if (!isValidObjectId(id)) return null;
    return await this.recipeModel.findOne({ _id: id });
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

    const recipes: (IRecipe | null)[] = await Promise.all(
      topTen.map((x) => this.getById(x._id)),
    );

    return recipes.filter((x) => !!x);
  }

  public async find(query: string): Promise<IRecipe[]> {
    const reg = new RegExp(`${query}`, 'i');
    return this.recipeModel
      .find({
        $or: [
          { title: reg },
          { category: { $all: [reg] } },
          { ingredients: { $all: [reg] } },
          { nutrition: { $all: [reg] } },
          { steps: { $all: [reg] } },
          { description: reg },
        ],
      })
      .limit(50);
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
    const categories = await this.getAvailableCategories();
    const dto = RecipeFormValidator.validate(createRecipeDTO, categories);

    const recipe = await this.recipeModel.create({
      ...dto,
      created: new Date().getTime(),
      updated: new Date().getTime(),
      author: user._id,
    });

    const url = 'https://fitnesshub.app/nutrition/recipe/' + recipe._id;
    this.tgbotService.sendURLMessage(
      `<b>${this.transformName(
        user,
      )}</b> hat ein neues <a href='${url}'>Rezept</a> hinzugefügt`,
      'Rezept online anschauen',
      url,
    );

    this.feedService.recipeCreated(recipe.toJSON());

    return recipe;
  }

  public async updateRecipe(
    id: string,
    userId: string,
    createRecipeDTO: CreateRecipeDTO,
  ): Promise<IRecipe | null> {
    const categories = await this.getAvailableCategories();
    const dto = RecipeFormValidator.validate(createRecipeDTO, categories);

    await this.recipeModel.updateOne(
      { _id: id, author: userId },
      { $set: { ...dto, updated: new Date().getTime() } },
    );

    const recipe = await this.recipeModel.findOne({ _id: id, author: userId });
    if (recipe) {
      this.feedService.recipeUpdate(recipe.toJSON());
      return recipe;
    }

    return this.getById(id);
  }

  public async deleteRecipe(userId: string, recipeId: string): Promise<void> {
    if (!recipeId || !isValidObjectId(recipeId)) return;

    const recipe = await this.recipeModel.findOne({
      _id: recipeId,
      author: userId,
    });
    if (recipe) {
      this.feedService.recipeDelete(recipeId);
    }

    await this.recipeModel.findOneAndDelete({ author: userId, _id: recipeId });
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

  private transformName(user: IUser): string {
    return [user.givenName, user.familyName].filter((x) => !!x).join(' ');
  }

  private async getAvailableCategories(): Promise<string[]> {
    return (await this.variableModel.find({ type: 'category' })).map(
      (x) => x.title,
    );
  }
}
