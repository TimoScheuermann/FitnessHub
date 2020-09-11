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

  public async getAll(): Promise<INutritionplan[]> {
    return this.nutritionplanModel.find().limit(50);
  }

  public async getByAuthor(author: string): Promise<INutritionplan[]> {
    return this.nutritionplanModel.find({
      author: author,
    });
  }

  public async getById(id: string): Promise<INutritionplan> {
    return await this.nutritionplanModel.findById({
      _id: id,
    });
  }

  public async getByCategory(category: string): Promise<INutritionplan[]> {
    return await this.nutritionplanModel
      .find({
        category: category,
      })
      .limit(50);
  }

  public async addNutritionplan(
    user: IUser,
    createNutritionplanDTO: CreateNutritionplanDTO,
  ): Promise<void> {
    if (
      [
        createNutritionplanDTO.title,
        createNutritionplanDTO.description,
        createNutritionplanDTO.category,
      ].filter((x) => x.length === 0).length > 0
    ) {
      return;
    }
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

  public async deleteNutritionplan(
    userId: string,
    nutritionplanId: string,
  ): Promise<void> {
    await this.nutritionplanModel.findOneAndDelete({
      author: userId,
      _id: nutritionplanId,
    });
  }

  public transformName(user: IUser): string {
    return [user.givenName, user.familyName].filter((x) => !!x).join(' ');
  }
}
