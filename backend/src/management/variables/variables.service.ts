import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVariableDTO } from './dtos/CreateVariable.dto';
import { IVariable } from './interfaces/IVariable';
import { Variable } from './schemas/Variable.schema';

@Injectable()
export class VariablesService {
  constructor(
    @InjectModel(Variable.name) private variableModel: Model<Variable>,
  ) {}

  /**
   * returns all variables
   */
  public async getAll(): Promise<IVariable[]> {
    return this.variableModel.find();
  }

  /**
   * removes a recipe category
   * @param id
   */
  public async removeCategory(id: string): Promise<void> {
    await this.variableModel.findOneAndDelete({ _id: id, type: 'category' });
  }

  /**
   * removes a muscle type
   * @param id
   */
  public async removeMuscle(id: string): Promise<void> {
    await this.variableModel.findOneAndDelete({ _id: id, type: 'muscle' });
  }

  /**
   * adds a new recipe category
   * @param createVariableDTO
   */
  public async addCategory(
    createVariableDTO: CreateVariableDTO,
  ): Promise<IVariable[]> {
    await this.variableModel.create({
      thumbnail: createVariableDTO.thumbnail,
      title: createVariableDTO.title,
      type: 'category',
    });
    return this.getCategories();
  }

  /**
   * adds a new muscle type
   * @param createVariableDTO
   */
  public async addMuscle(
    createVariableDTO: CreateVariableDTO,
  ): Promise<IVariable[]> {
    await this.variableModel.create({
      thumbnail: createVariableDTO.thumbnail,
      title: createVariableDTO.title,
      type: 'muscle',
    });
    return this.getMuscles();
  }

  /**
   * returns all recipe categories
   */
  public async getCategories(): Promise<IVariable[]> {
    return this.variableModel.find({ type: 'category' });
  }

  /**
   * returns all muscle types
   */
  public async getMuscles(): Promise<IVariable[]> {
    return this.variableModel.find({ type: 'muscle' });
  }
}
