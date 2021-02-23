import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FormValidator } from 'src/FormValidator';
import { Variable } from 'src/management/variables/schemas/Variable.schema';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { UpdateRecipeDTO } from './dtos/UpdateRecipe.dto';
import { INutrition } from './interfaces/INutrition';
import { IRecipe } from './interfaces/IRecipe';
import { IRecipeIngredient } from './interfaces/IRecipeIngredient';
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
    let { category, steps, ingredients, nutrition } = createRecipeDTO;

    const { difficulty, thumbnail, time, title } = createRecipeDTO;

    FormValidator.checkString(title, 'Bitte gib einen Titel an');
    FormValidator.checkString(thumbnail, 'Bitte gib ein Vorschaubild an');

    category = FormValidator.checkStringArray(
      category,
      'Bitte gib eine Kategorie an',
    );

    FormValidator.checkNumber(difficulty, 'Bitte gib eine Schwierigkeit an');
    FormValidator.checkNumberMinMax(
      difficulty,
      1,
      3,
      'Die Schwierigkeit muss zwischen 1 und 3 liegen',
    );

    steps = FormValidator.checkStringArray(
      steps,
      'Bitte gib die Zubereitungsschritte an',
    );

    FormValidator.checkNumber(
      time,
      'Bitte gib eine durchschnittliche Zubereitungszeit an',
    );
    FormValidator.checkNumberMinMax(
      time,
      1,
      Number.MAX_VALUE,
      'Die Zubereitungszeit kann nicht unter einer Sekunde liegen',
    );

    ingredients = this.checkIngredients(createRecipeDTO.ingredients);
    nutrition = this.checkNutrition(createRecipeDTO.nutrition);

    category = FormValidator.compareStringArry(
      category,
      await this.getAvailableCategories(),
      ' ist keine verfügbare Kategorie',
    );

    const recipe = await this.recipeModel.create({
      ...createRecipeDTO,
      ingredients: ingredients,
      nutrition: nutrition,
      steps: steps,
      category: category,
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
    return recipe;
  }

  public async updateRecipe(
    id: string,
    userId: string,
    updateRecipeDTO: UpdateRecipeDTO,
  ): Promise<IRecipe> {
    await this.recipeModel.updateOne(
      { _id: id, author: userId },
      {
        $set: {
          ...updateRecipeDTO,
          updated: new Date().getTime(),
        },
      },
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

  private transformName(user: IUser): string {
    return [user.givenName, user.familyName].filter((x) => !!x).join(' ');
  }

  private async getAvailableCategories(): Promise<string[]> {
    return (await this.variableModel.find({ type: 'category' })).map(
      (x) => x.title,
    );
  }

  private checkIngredients(ing: IRecipeIngredient[]): IRecipeIngredient[] {
    if (!ing || ing.length === 0) {
      FormValidator.throwEx('Bitte gib eine Zutatenliste an');
    }
    return ing.map((x, i) => {
      return {
        name: FormValidator.checkString(
          x.name,
          'Der Name der Zutat #' + (i + 1) + 'fehlt',
        ),
        amount: FormValidator.checkString(
          x.amount,
          'Die Mange die an ' + x.name + ' benötigt wird fehlt',
        ),
        unit: FormValidator.checkString(
          x.unit,
          'Die Einheit der Menge der Zutat ' + x.name + ' fehlt',
        ),
      };
    });
  }

  private checkNutrition(nut: INutrition[]): INutrition[] {
    if (!nut || nut.length === 0) {
      FormValidator.throwEx('Bitte gib eine Nährtwertliste an');
    }
    return nut.map((x, i) => {
      return {
        title: FormValidator.checkString(
          x.title,
          'Der Name des Nährwerts #' + (i + 1) + 'fehlt',
        ),

        amount: FormValidator.checkNumberMinMax(
          FormValidator.checkNumber(
            x.amount,
            'Die Mange des Nährwerts ' + x.title + ' fehlt',
          ),
          0,
          Number.MAX_VALUE,
          'Die Nährwertsmenge von ' +
            x.title +
            ' kann nicht kleiner als 0 sein',
        ),
        unit: FormValidator.checkString(
          x.unit,
          'Die Einheit des Nährwerts ' + x.title + ' fehlt',
        ),
      };
    });
  }
}
