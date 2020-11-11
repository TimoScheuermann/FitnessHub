import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IHealth } from './interfaces/IHealth';
import { Health } from './schemas/Health.schema';

export enum HealthType {
  WEIGHT = 'weight',
  WATER = 'water',
  HEIGHT = 'height',
}

@Injectable()
export class HealthService {
  constructor(@InjectModel(Health.name) private healthModel: Model<Health>) {}

  /**
   * returns the water data of a specific user
   * @param userId string
   */
  public async getWaterData(userId: string): Promise<IHealth[]> {
    return this.getDataOfType(userId, HealthType.WATER);
  }

  /**
   * returns the weight data of a specific user
   * @param userId string
   */
  public async getWeightData(userId: string): Promise<IHealth[]> {
    return this.getDataOfType(userId, HealthType.WEIGHT);
  }

  /**
   * returns the current height of a specific user
   * @param userId string
   */
  public async getCurrentHeight(userId: string): Promise<number> {
    const data = await this.healthModel
      .find({ user: userId, type: HealthType.HEIGHT })
      .sort({ date: -1 })
      .limit(1);
    if (!data || data.length == 0) return -1;
    return data[0].value;
  }

  /**
   * returns todays water intake of a specific user
   * @param userId string
   */
  public async getTodaysWater(userId: string): Promise<number> {
    const data = await this.healthModel.findOne({
      user: userId,
      type: HealthType.WATER,
      date: new Date().setHours(0, 0, 0, 0),
    });
    if (data) return data.value;
    return 0;
  }

  /**
   * returns the current weight of a specific user
   * @param userId string
   */
  public async getCurrentWeight(userId: string): Promise<number> {
    const data = await this.healthModel
      .find({ user: userId, type: HealthType.WEIGHT })
      .sort({ date: -1 })
      .limit(1);
    if (!data || data.length == 0) return -1;
    return data[0].value;
  }

  /**
   * returns the height data of a specific user
   * @param userId string
   */
  public async getHeightData(userId: string): Promise<IHealth> {
    return this.healthModel.findOne({ user: userId, type: HealthType.HEIGHT });
  }

  /**
   * returns health data of a specific type of a specific user
   * @param userId string
   * @param type HealthType
   */
  private async getDataOfType(
    userId: string,
    type: HealthType,
  ): Promise<IHealth[]> {
    return this.healthModel.find({
      user: userId,
      type: type,
      date: { $gte: new Date().getTime() - 31557600000 },
    });
  }

  /**
   * adds a specific amount of water intake to a spefic user
   * @param userId string
   * @param amount number
   */
  public async addWater(userId: string, amount: number): Promise<IHealth> {
    const date = new Date().setHours(0, 0, 0, 0);
    await this.healthModel.updateOne(
      { user: userId, type: HealthType.WATER, date: date },
      { $inc: { value: amount } },
      { upsert: true },
    );
    return await this.healthModel.findOne({
      user: userId,
      type: HealthType.WATER,
      date: date,
    });
  }

  /**
   * adds weight data of a specific user
   * @param userId string
   * @param amount current weight
   */
  public async addWeight(userId: string, amount: number): Promise<IHealth> {
    return await this.healthModel.create({
      date: new Date().getTime(),
      type: HealthType.WEIGHT,
      user: userId,
      value: amount,
    });
  }

  /**
   * adds height data of a specific user
   * @param userId string
   * @param amount current height
   */
  public async setHeight(userId: string, amount: number): Promise<void> {
    await this.healthModel.updateOne(
      { user: userId, type: HealthType.HEIGHT },
      { $set: { value: amount, date: new Date().getTime() } },
      { upsert: true },
    );
  }

  /**
   * deletes a specific health data
   * @param userID string
   * @param id healthDataId
   */
  public async deleteHealthData(userID: string, id: string): Promise<void> {
    await this.healthModel.findOneAndDelete({
      _id: id,
      user: userID,
    });
  }
}
