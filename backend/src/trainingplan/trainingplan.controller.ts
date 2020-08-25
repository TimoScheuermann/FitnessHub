import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { ITrainingplan } from './interfaces/ITrainingplan';
import { TrainingplanService } from './trainingplan.service';

@Controller('trainingplan')
export class TrainingplanController {
  constructor(private readonly trainingplanService: TrainingplanService) {}

  // timo 5f453b8db14a934804094c36

  @Get()
  async getAllPlans(): Promise<ITrainingplan[]> {
    await this.trainingplanService.updateById({
      ...(
        await this.trainingplanService.getPlanById('5f455c0ad3f38d41288bc0e5')
      ).toObject(),
      author: '5f453b8db14a934804094c36',
      title: 'First plan',
    });
    return this.trainingplanService.getAllPlans();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ITrainingplan> {
    return this.trainingplanService.getPlanById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<ITrainingplan> {
    return this.trainingplanService.deletePlanById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  async updateById(@Body() plan: ITrainingplan): Promise<ITrainingplan> {
    return this.trainingplanService.updateById(plan);
  }

  @Post()
  async createTrainingplan(
    @Body() plan: ITrainingplan,
  ): Promise<ITrainingplan> {
    return this.trainingplanService.create(plan);
  }
}
