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
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateWorkoutDTO } from './dtos/CreateWorkout.dto';
import { IWorkout } from './interfaces/IWorkout';
import { WorkoutService } from './workout.service';

@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('')
  async getAllWorkouts(@FHUser() user: IUser): Promise<IWorkout[]> {
    return this.workoutService.getWorkouts(user);
  }

  @Get('latest')
  async getLatestWorkouts(): Promise<IWorkout[]> {
    return this.workoutService.getLatestWorkouts();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<IWorkout> {
    return this.workoutService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('')
  async createWorkout(
    @FHUser() user: IUser,
    @Body() workout: CreateWorkoutDTO,
  ): Promise<void> {
    this.workoutService.createWorkout(user, workout);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  async updateWorkout(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() workout: CreateWorkoutDTO,
  ): Promise<void> {
    this.workoutService.updateWorkout(user, id, workout);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteWorkout(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    this.workoutService.deleteWorkout(user, id);
  }
}
