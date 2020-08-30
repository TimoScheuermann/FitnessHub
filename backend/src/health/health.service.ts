import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IHealth } from './interfaces/IHealth';
import { Health } from './schemas/Health.schema';

export enum HealthType {
  WEIGHT = 'weight',
  HEIGHT = 'height',
}

@Injectable()
export class HealthService {
  constructor(@InjectModel(Health.name) private healthModel: Model<Health>) {}

  public async addHealthData(userID: string, type: HealthType, value: number) {
    await this.healthModel.create({
      date: new Date().getTime(),
      type: type,
      user: userID,
      value: value,
    });
  }

  public async getAllHealthData(userID: string): Promise<IHealth[]> {
    return this.healthModel.find({
      user: userID,
      date: { $gte: new Date().getTime() - 31557600000 },
    });
  }

  public async deleteHealthData(userID: string, id: string): Promise<void> {
    await this.healthModel.findOneAndDelete({
      _id: id,
      user: userID,
    });
  }
}
