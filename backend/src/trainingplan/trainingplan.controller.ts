import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import FPUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { ITrainingplan } from './interfaces/ITrainingplan';
import { TrainingplanService } from './trainingplan.service';

@Controller('trainingplan')
export class TrainingplanController {
  constructor(private readonly trainingplanService: TrainingplanService) {}

  @Get()
  async getAllPlans(): Promise<ITrainingplan[]> {
    return this.trainingplanService.getAllPlans();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ITrainingplan> {
    return this.trainingplanService.getPlanById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteById(
    @FPUser() user: IUser,
    @Param('id') id: string,
  ): Promise<ITrainingplan> {
    const plan = await this.trainingplanService.getPlanById(id);
    if (plan.author !== user._id) {
      throw new UnauthorizedException();
    }
    return this.trainingplanService.deletePlanById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  async updateById(
    @FPUser() user: IUser,
    @Body() plan: ITrainingplan,
  ): Promise<ITrainingplan> {
    if (plan.author !== user._id) {
      throw new UnauthorizedException();
    }
    return this.trainingplanService.updateById(plan);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createTrainingplan(
    @FPUser() user: IUser,
    @Body() plan: ITrainingplan,
  ): Promise<ITrainingplan> {
    return this.trainingplanService.create({ ...plan, author: user._id });
  }
}
