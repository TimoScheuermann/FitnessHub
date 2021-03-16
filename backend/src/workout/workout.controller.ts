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
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateWorkoutDTO } from './dtos/CreateWorkout.dto';
import { IWorkout } from './interfaces/IWorkout';
import { WorkoutService } from './workout.service';

@ApiTags('Workout')
@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  /**
   * Returns workouts of specific user
   * @param user author
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('')
  async getAllWorkouts(@FHUser() user: IUser): Promise<IWorkout[]> {
    return this.workoutService.getWorkouts(user);
  }

  /**
   * Returns latest 10 workouts
   */
  @Get('latest')
  async getLatestWorkouts(): Promise<IWorkout[]> {
    return this.workoutService.getLatestWorkouts();
  }

  /**
   * Returns workout with specific ID
   * @param id workoutId
   */
  @Get(':id')
  async getById(@Param('id') id: string): Promise<IWorkout> {
    return this.workoutService.getById(id);
  }

  /**
   * Creates workout with specific user as author
   * @param user author
   * @param workout new workout
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('')
  async createWorkout(
    @FHUser() user: IUser,
    @Body() workout: CreateWorkoutDTO,
  ): Promise<IWorkout> {
    return this.workoutService.createWorkout(user, workout);
  }

  /**
   * Updates workout by specific user
   * @param user author
   * @param id workoutId
   * @param workout updated workout
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  async updateWorkout(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() workout: CreateWorkoutDTO,
  ): Promise<IWorkout> {
    return this.workoutService.updateWorkout(user, id, workout);
  }

  /**
   * Deletes workout of specific user
   * @param user author
   * @param id workoutId
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteWorkout(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    this.workoutService.deleteWorkout(user, id);
  }
}
