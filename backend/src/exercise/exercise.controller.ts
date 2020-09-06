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
import { UpdateExerciseDTO } from './dtos/UpdateExercise.dto';
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
    @Body() update: UpdateExerciseDTO,
  ): Promise<IExercise> {
    return this.exerciseService.submitChange(id, update, user);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('publish/:id')
  async publicExercise(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: UpdateExerciseDTO,
  ): Promise<void> {
    this.exerciseService.publishExercise(id, update, user);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('accept/:id')
  async acceptChanges(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: UpdateExerciseDTO,
  ): Promise<void> {
    this.exerciseService.acceptChange(id, user, update);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('reject/:id')
  async rejectChanges(@Param('id') id: string): Promise<void> {
    this.exerciseService.rejectChange(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteOwnExercise(
    @Param('id') id: string,
    @FHUser() user: IUser,
  ): Promise<void> {
    this.exerciseService.deleteOwnExercise(id, user);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('delete/:id')
  async deleteExercise(@Param('id') id: string): Promise<void> {
    this.exerciseService.deleteExercise(id);
  }
}
