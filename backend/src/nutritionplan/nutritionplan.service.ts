import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Variable } from 'src/management/variables/schemas/Variable.schema';
import { Recipe } from 'src/recipe/schemas/Recipe.schema';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { FHBot } from 'src/user/FHBot.user';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateNutritionplanDTO } from './dtos/CreateNutritionplan.dto';
import { INutritionplanFull } from './interfaces/INutritionplanFull';
import { NutritionplanFormValidator } from './NutritionplanFormValidator';
import { Nutritionplan } from './schemas/Nutritionplan.schema';

@Injectable()
export class NutritionplanService {
  constructor(
    @InjectModel(Nutritionplan.name)
    private nutritionplanModel: Model<Nutritionplan>,
    @InjectModel(Variable.name)
    private variableModel: Model<Variable>,
    @InjectModel(Recipe.name)
    private recipeModel: Model<Recipe>,
    private readonly tgbotService: TgbotService,
  ) {}

  /**
   * returns nutrition plans (limit 50)
   */
  public async getAll(): Promise<INutritionplanFull[]> {
    const nutritionplans = await this.nutritionplanModel.find().limit(50);
    return this.mapNutritionplans(nutritionplans);
  }

  /**
   * returns all nutrition plans created by a specific author
   * @param author string
   */
  public async getByAuthor(author: string): Promise<INutritionplanFull[]> {
    const nutritionplans = await this.nutritionplanModel.find({
      author: author,
    });
    return this.mapNutritionplans(nutritionplans);
  }

  /**
   * returns a specific nutrition plan by id
   * @param id string
   */
  public async getById(id: string): Promise<INutritionplanFull> {
    const nutritionplan = await this.nutritionplanModel.findById({
      _id: id,
    });
    return (await this.mapNutritionplans([nutritionplan]))[0];
  }

  /**
   * returns a list of nutrition plans with a specific category (limit 50)
   * @param category string
   */
  public async getByCategory(category: string): Promise<INutritionplanFull[]> {
    const nutritionplans = await this.nutritionplanModel
      .find({
        category: category,
      })
      .limit(50);

    return await this.mapNutritionplans(nutritionplans);
  }

  /**
   * creates a new nutrition plan
   * @param user author
   * @param createNutritionplanDTO nutritionplan
   */
  public async addNutritionplan(
    user: IUser,
    dto: CreateNutritionplanDTO,
  ): Promise<INutritionplanFull> {
    const categories = await this.getAvailableCategories();
    const recipes = await this.getRecipeIDs();
    dto = await NutritionplanFormValidator.validate(dto, categories, recipes);
    const nutritionplan = await this.nutritionplanModel.create({
      ...dto,
      created: new Date().getTime(),
      updated: new Date().getTime(),
      author: user._id,
    });
    return (await this.mapNutritionplans([nutritionplan]))[0];
  }

  /**
   * updates a specific nutrition plan of a user
   * @param id edited nutritionplan
   * @param userId author
   * @param update new data
   */
  public async updateNutritionplan(
    id: string,
    // userId: string,
    update: CreateNutritionplanDTO,
  ): Promise<INutritionplanFull> {
    const categories = await this.getAvailableCategories();
    const recipes = await this.getRecipeIDs();
    update = await NutritionplanFormValidator.validate(
      update,
      categories,
      recipes,
    );

    await this.nutritionplanModel.updateOne(
      { _id: id },
      { $set: { ...update, updated: new Date().getTime() } },
    );

    const nutritionplan = await this.nutritionplanModel.findOne({
      _id: id,
    });

    return (await this.mapNutritionplans([nutritionplan]))[0];
  }

  /**
   * deletes a specific nutritionplan of a specific user
   * @param userId user
   * @param nutritionplanId nutritionplan
   */
  public async deleteNutritionplan(
    // userId: string,
    nutritionplanId: string,
  ): Promise<void> {
    await this.nutritionplanModel.findOneAndDelete({
      _id: nutritionplanId,
    });
  }

  /**
   * transforms a users name to his fullname
   * @param user IUser
   */
  public transformName(user: IUser): string {
    return [user.givenName, user.familyName].filter((x) => !!x).join(' ');
  }

  private async getAvailableCategories(): Promise<string[]> {
    return (await this.variableModel.find({ type: 'category' })).map(
      (x) => x.title,
    );
  }

  private async getRecipeIDs(): Promise<string[]> {
    const recipes = await this.recipeModel.find();
    return recipes.map((r) => r._id);
  }

  /**
   * Replaces Recipe IDs with Full Recipe Object
   * @param nutritionplans Nutritionplan
   * @returns Full Nutritionplan
   */
  private async mapNutritionplans(
    nutritionplans: Nutritionplan[],
  ): Promise<INutritionplanFull[]> {
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    const daytime = ['breakfast', 'lunch', 'dinner'];

    let recipeIDs = [];

    nutritionplans.forEach((n) => {
      days.forEach((d) => {
        daytime.forEach((dt) => {
          recipeIDs.push(n[d][dt]);
        });
        const snacks = n[d].snacks;
        if (snacks && snacks.length > 0) {
          recipeIDs.push(...snacks);
        }
      });
    });

    recipeIDs = [...new Set(recipeIDs)].filter((x) => x && isValidObjectId(x));

    const recipes = await this.recipeModel.find({
      _id: { $in: recipeIDs },
    });

    const getRecipe = (id: string): Recipe | null => {
      return recipes.filter((x) => x._id == id)[0] || null;
    };

    return nutritionplans.map((x) => {
      return {
        _id: x._id,
        author: x.author || FHBot._id,
        created: x.created,
        updated: x.updated,

        title: x.title,
        description: x.description,
        categories: x.categories,

        monday: {
          breakfast: getRecipe(x.monday.breakfast),
          lunch: getRecipe(x.monday.lunch),
          dinner: getRecipe(x.monday.dinner),
          snacks: (x.monday.snacks || []).map((x) => getRecipe(x)),
        },

        tuesday: {
          breakfast: getRecipe(x.tuesday.breakfast),
          lunch: getRecipe(x.tuesday.lunch),
          dinner: getRecipe(x.tuesday.dinner),
          snacks: (x.tuesday.snacks || []).map((x) => getRecipe(x)),
        },

        wednesday: {
          breakfast: getRecipe(x.wednesday.breakfast),
          lunch: getRecipe(x.wednesday.lunch),
          dinner: getRecipe(x.wednesday.dinner),
          snacks: (x.wednesday.snacks || []).map((x) => getRecipe(x)),
        },

        thursday: {
          breakfast: getRecipe(x.thursday.breakfast),
          lunch: getRecipe(x.thursday.lunch),
          dinner: getRecipe(x.thursday.dinner),
          snacks: (x.thursday.snacks || []).map((x) => getRecipe(x)),
        },

        friday: {
          breakfast: getRecipe(x.friday.breakfast),
          lunch: getRecipe(x.friday.lunch),
          dinner: getRecipe(x.friday.dinner),
          snacks: (x.friday.snacks || []).map((x) => getRecipe(x)),
        },

        saturday: {
          breakfast: getRecipe(x.saturday.breakfast),
          lunch: getRecipe(x.saturday.lunch),
          dinner: getRecipe(x.saturday.dinner),
          snacks: (x.saturday.snacks || []).map((x) => getRecipe(x)),
        },

        sunday: {
          breakfast: getRecipe(x.sunday.breakfast),
          lunch: getRecipe(x.sunday.lunch),
          dinner: getRecipe(x.sunday.dinner),
          snacks: (x.sunday.snacks || []).map((x) => getRecipe(x)),
        },
      };
    });
  }
}
