import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { ITrainingplanFull } from './interfaces/ITrainingplanFull';
import { Trainingplan } from './schemas/Trainingplan.schema';
import { TrainingplanService } from './trainingplan.service';

@ApiTags('Trainingsplan')
@Controller('trainingplan')
export class TrainingplanController {
  constructor(private readonly trainingplanService: TrainingplanService) {}

  /**
   * Returns trainingplan of specific user
   * @param user author
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getTrainingplan(@FHUser() user: IUser): Promise<Trainingplan> {
    return this.trainingplanService.getTrainingplan(user._id);
  }

  /**
   * Returns full traningsplan of specific user
   * @param user author
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('full')
  async getFullTrainingplan(@FHUser() user: IUser): Promise<ITrainingplanFull> {
    return this.trainingplanService.getFullTrainingplan(user._id);
  }

  /**
   * Adds workout or exercise to specific day
   * @param user author
   * @param day specific day
   * @param id workout or exercise id
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':day/:id')
  async setWorkoutForDay(
    @FHUser() user: IUser,
    @Param('day') day: number,
    @Param('id') id: string,
  ): Promise<ITrainingplanFull> {
    return this.trainingplanService.setIdForDay(user._id, day, id);
  }

  /**
   * Removes workout or exercise of specific day
   * @param user author
   * @param day specific day
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':day')
  async removeDay(
    @FHUser() user: IUser,
    @Param('day') day: number,
  ): Promise<ITrainingplanFull> {
    return this.trainingplanService.removeDay(user._id, day);
  }
}
