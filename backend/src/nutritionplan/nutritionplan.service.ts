import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateNutritionplanDTO } from './dtos/CreateNutritionplan.dto';
import { UpdateNutritionplanDTO } from './dtos/UpdateNutritionplan.dto';
import { INutritionplan } from './interfaces/INutritionplan';
import { Nutritionplan } from './schemas/Nutritionplan.schema';

@Injectable()
export class NutritionplanService {
  constructor(
    @InjectModel(Nutritionplan.name)
    private nutritionplanModel: Model<Nutritionplan>,
    private readonly tgbotService: TgbotService,
  ) {}

  /**
   * returns all nutrition plans
   */
  public async getAll(): Promise<INutritionplan[]> {
    return this.nutritionplanModel.find().limit(50);
  }

  /**
   * returns all nutrition plans created by a specific user
   * @param author string
   */
  public async getByAuthor(author: string): Promise<INutritionplan[]> {
    return this.nutritionplanModel.find({
      author: author,
    });
  }

  /**
   * returns a specific nutrition plan by id
   * @param id string
   */
  public async getById(id: string): Promise<INutritionplan> {
    return await this.nutritionplanModel.findById({
      _id: id,
    });
  }

  /**
   * returns a list of nutrition plans with a specific category (limit 50)
   * @param category string
   */
  public async getByCategory(category: string): Promise<INutritionplan[]> {
    return await this.nutritionplanModel
      .find({
        category: category,
      })
      .limit(50);
  }

  /**
   * creates a new nutrition plan
   * @param user author
   * @param createNutritionplanDTO nutritionplan
   */
  public async addNutritionplan(
    user: IUser,
    createNutritionplanDTO: CreateNutritionplanDTO,
  ): Promise<void> {
    // check for missing information
    if (
      [
        createNutritionplanDTO.title,
        createNutritionplanDTO.description,
        createNutritionplanDTO.category,
      ].filter((x) => x.length === 0).length > 0
    ) {
      return;
    }
    // check if time exists and is greater than 0
    if (!createNutritionplanDTO.time || createNutritionplanDTO.time <= 0) {
      return;
    }

    const nutritionplan = await this.nutritionplanModel.create({
      ...createNutritionplanDTO,
      created: new Date().getTime(),
      updated: new Date().getTime(),
      author: user._id,
    });

    const url = 'https://api.timos.design:3000/recipe/' + nutritionplan._id;
    this.tgbotService.sendURLMessage(
      `<b>${this.transformName(
        user,
      )}</b> hat ein neues <a href='${url}'>Rezept</a> hinzugefügt`,
      'Rezept online anschauen',
      url,
    );
  }

  /**
   * updates a specific nutrition plan of a user
   * @param id edited nutritionplan
   * @param userId author
   * @param updateNutritionplanDTO new data
   */
  public async updateNutritionplan(
    id: string,
    userId: string,
    updateNutritionplanDTO: UpdateNutritionplanDTO,
  ): Promise<void> {
    await this.nutritionplanModel.updateOne(
      { _id: id, author: userId },
      { $set: { ...updateNutritionplanDTO, updated: new Date().getTime() } },
    );
  }

  /**
   * deletes a specific nutritionplan of a specifiv user
   * @param userId user
   * @param nutritionplanId nutritionplan
   */
  public async deleteNutritionplan(
    userId: string,
    nutritionplanId: string,
  ): Promise<void> {
    await this.nutritionplanModel.findOneAndDelete({
      author: userId,
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
}
