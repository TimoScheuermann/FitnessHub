import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITrainingplan } from './interfaces/ITrainingplan';
import { Trainingplan } from './schemas/Trainingplan.schema';

@Injectable()
export class TrainingplanService {
  constructor(
    @InjectModel(Trainingplan.name)
    private trainingplanModel: Model<Trainingplan>,
  ) {}

  async getPlanById(id: string): Promise<Trainingplan> {
    return this.trainingplanModel.findOne({
      _id: id,
    });
  }

  async getAllPlans(): Promise<Trainingplan[]> {
    return this.trainingplanModel.find().limit(50);
  }

  async create(plan: ITrainingplan): Promise<Trainingplan> {
    delete plan._id;
    return this.trainingplanModel.create(plan);
  }

  async updateById(plan: ITrainingplan): Promise<Trainingplan> {
    const id = plan._id;
    delete plan._id;
    return this.trainingplanModel.findOneAndUpdate({ _id: id }, plan);
  }

  async deletePlanById(id: string): Promise<Trainingplan> {
    return this.trainingplanModel.findOneAndDelete({ _id: id });
  }

  async getPlansOfUser(userId: string): Promise<Trainingplan[]> {
    return this.trainingplanModel.find({ author: userId });
  }
}
