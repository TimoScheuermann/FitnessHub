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

  public async getWaterData(userId: string): Promise<IHealth[]> {
    return this.getDataOfType(userId, HealthType.WATER);
  }

  public async getWeightData(userId: string): Promise<IHealth[]> {
    return this.getDataOfType(userId, HealthType.WEIGHT);
  }
  public async getCurrentWeight(userId: string): Promise<number> {
    const data = await this.healthModel
      .find({ user: userId, type: HealthType.WEIGHT })
      .sort({ date: -1 })
      .limit(1);
    if (!data || data.length == 0) return -1;
    return data[0].value;
  }

  public async getHeightData(userId: string): Promise<IHealth> {
    return this.healthModel.findOne({ user: userId, type: HealthType.HEIGHT });
  }

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

  public async addWeight(userId: string, amount: number): Promise<IHealth> {
    return await this.healthModel.create({
      date: new Date().getTime(),
      type: HealthType.WEIGHT,
      user: userId,
      value: amount,
    });
  }

  public async setHeight(userId: string, amount: number): Promise<void> {
    await this.healthModel.updateOne(
      { user: userId, type: HealthType.HEIGHT },
      { $set: { value: amount, date: new Date().getTime() } },
      { upsert: true },
    );
  }

  public async deleteHealthData(userID: string, id: string): Promise<void> {
    await this.healthModel.findOneAndDelete({
      _id: id,
      user: userID,
    });
  }
}
