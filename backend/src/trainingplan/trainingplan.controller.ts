import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { ITrainingplan } from './interfaces/ITrainingplan';
import { ITrainingplanFull } from './interfaces/ITrainingplanFull';
import { TrainingplanService } from './trainingplan.service';

@Controller('trainingplan')
export class TrainingplanController {
  constructor(private readonly trainingplanService: TrainingplanService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getTrainingplan(@FHUser() user: IUser): Promise<ITrainingplan> {
    return this.trainingplanService.getTrainingplan(user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('full')
  async getFullTrainingplan(@FHUser() user: IUser): Promise<ITrainingplanFull> {
    return this.trainingplanService.getFullTrainingplan(user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':day/:id')
  async setWorkoutForDay(
    @FHUser() user: IUser,
    @Param('day') day: number,
    @Param('id') id: string,
  ): Promise<ITrainingplanFull> {
    return this.trainingplanService.setIdForDay(user._id, day, id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':day')
  async removeDay(
    @FHUser() user: IUser,
    @Param('day') day: number,
  ): Promise<ITrainingplanFull> {
    return this.trainingplanService.removeDay(user._id, day);
  }
}
