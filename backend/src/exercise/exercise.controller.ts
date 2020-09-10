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
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateExerciseDTO } from './dtos/CreateExercise.dto';
import { FinishExerciseDTO } from './dtos/FinishExercise.dto';
import { ExerciseService } from './exercise.service';
import { IExercise } from './interfaces/IExercise';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  async getAll(): Promise<IExercise[]> {
    return this.exerciseService.getAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('mine')
  async getByAuthor(@FHUser() user: IUser): Promise<IExercise[]> {
    return this.exerciseService.getByAuthor(user._id);
  }

  @Get('trending')
  async getTrendingExercises(): Promise<any[]> {
    return this.exerciseService.getTrendingExercises();
  }

  @Get('muscle/:muscle')
  async getByMuscle(@Param('muscle') muscle: string): Promise<IExercise[]> {
    return this.exerciseService.getByMuscle(muscle);
  }

  @Get('find/:query')
  async findExercise(@Param('query') query: string): Promise<IExercise[]> {
    return this.exerciseService.find(query);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('submissions')
  async getSubmitted(@FHUser() user: IUser): Promise<IExercise[]> {
    return this.exerciseService.getSubmissions(user._id);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<IExercise> {
    return this.exerciseService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('finished')
  async exerciseFinished(
    @FHUser() user: IUser,
    @Body() finish: FinishExerciseDTO,
  ): Promise<void> {
    this.exerciseService.finished(user, finish);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createExercise(
    @FHUser() user: IUser,
    @Body() create: CreateExerciseDTO,
  ): Promise<void> {
    this.exerciseService.create(create, user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('update/:id')
  async updateExercise(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: CreateExerciseDTO,
  ): Promise<void> {
    return this.exerciseService.submitChange(id, update, user);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('publish/:id')
  async publicExercise(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: CreateExerciseDTO,
  ): Promise<void> {
    this.exerciseService.publishExercise(id, update, user);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('rejectChanges/:id')
  async rejectChanges(@Param('id') id: string): Promise<void> {
    this.exerciseService.rejectChanges(id);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteExercise(@Param('id') id: string): Promise<void> {
    this.exerciseService.deleteExercise(id);
  }
}
