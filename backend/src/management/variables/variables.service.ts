import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
  public async addCategory(dto: CreateVariableDTO): Promise<IVariable> {
    dto = this.validateDTO(dto);
    return await this.variableModel.create({ ...dto, type: 'category' });
  }

  /**
   * adds a new muscle type
   * @param createVariableDTO
   */
  public async addMuscle(dto: CreateVariableDTO): Promise<IVariable> {
    dto = this.validateDTO(dto);
    return await this.variableModel.create({ ...dto, type: 'muscle' });
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

  private validateDTO(dto: CreateVariableDTO): CreateVariableDTO {
    const { thumbnail, title } = dto;
    if (!thumbnail || thumbnail.length === 0) {
      throw new UnprocessableEntityException('Bitte gib ein Vorschaubild an');
    }

    if (!title || title.length === 0) {
      throw new UnprocessableEntityException('Bitte gib einen Titel an');
    }

    return {
      thumbnail: dto.thumbnail,
      title: dto.title,
    };
  }
}
