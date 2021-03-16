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
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { FriendIDParam, FriendsGuard } from 'src/friends/friends.guard';
import { FHSetting, SettingGuard } from 'src/setting/setting.guard';
import { AvailableSetting } from 'src/setting/setting.service';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateExerciseDTO } from './dtos/CreateExercise.dto';
import { FinishExerciseDTO } from './dtos/FinishExercise.dto';
import { ExerciseService } from './exercise.service';
import { IExercise } from './interfaces/IExercise';
import { IExerciseShowcase } from './interfaces/IExerciseShowcase';

@ApiTags('Exercise')
@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  /**
   * Returns the latest 50 exercises
   */
  @Get()
  async getAll(): Promise<IExercise[]> {
    return this.exerciseService.getAll();
  }

  /**
   * Returns exercises submitted by a specific user
   * @param user FHUser
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('mine')
  async getByAuthor(@FHUser() user: IUser): Promise<IExercise[]> {
    return this.exerciseService.getByAuthor(user._id);
  }

  /**
   * Returns recent exercises done by a specific user
   * @param user FHUser
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('recent')
  async getRecent(@FHUser() user: IUser): Promise<IExercise[]> {
    return this.exerciseService.getRecent(user._id);
  }

  /**
   * Returns recent exercises done by a specific user
   * @param userId
   */
  @FriendIDParam('userId')
  @FHSetting(AvailableSetting.FRIENDS_SHARE_LATEST_WORKOUTS)
  @UseGuards(AuthGuard('jwt'), RolesGuard, FriendsGuard, SettingGuard)
  @Get('recent/:userId')
  async getRecentOf(@Param('userId') userId: string): Promise<IExercise[]> {
    return this.exerciseService.getRecent(userId);
  }

  /**
   * Returns the 10 most recent exercises done in the past 7 days
   */
  @Get('trending')
  async getTrendingExercises(): Promise<any[]> {
    return this.exerciseService.getTrendingExercises();
  }

  /**
   * Returns the 10 latest published exercises
   */
  @Get('latest')
  async getLatestExercises(): Promise<any[]> {
    return this.exerciseService.getLatestExercises();
  }

  /**
   * Returns all exercises with a specific muscle involved (limit 50)
   * @param muscle Muscle
   */
  @Get('muscle/:muscle')
  async getByMuscle(@Param('muscle') muscle: string): Promise<IExercise[]> {
    return this.exerciseService.getByMuscle(muscle);
  }

  /**
   * Returns all exercises which match the given query (limit 50)
   * @param query Query
   */
  @Get('find/:query')
  async findExercise(@Param('query') query: string): Promise<IExercise[]> {
    return this.exerciseService.find(query);
  }

  /**
   * Returns IExercieShowcase for given Ids
   * @param ids string[]
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('showcases')
  async getExerciseShowcases(
    @Body() ids: string[],
  ): Promise<IExerciseShowcase[]> {
    return this.exerciseService.getShowcases(ids);
  }

  /**
   * Returns all submitted exercises (new and updated ones)
   * @param user FHUser
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('submissions')
  async getSubmitted(@FHUser() user: IUser): Promise<IExercise[]> {
    return this.exerciseService.getSubmissions(user._id);
  }

  /**
   * Returns a specific exercise
   * @param id string
   */
  @Get(':id')
  async getById(@Param('id') id: string): Promise<IExercise> {
    return this.exerciseService.getById(id);
  }

  /**
   * Stores a finished workout in the database
   * @param user FHUser
   * @param finished FinishedExerciseDTO
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('finished')
  async exerciseFinished(
    @FHUser() user: IUser,
    @Body() finished: FinishExerciseDTO[],
  ): Promise<void> {
    this.exerciseService.finished(user, finished);
  }

  /**
   * Submits a new exercise
   * @param user FHUser
   * @param create CreateExerciseDTO
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createExercise(
    @FHUser() user: IUser,
    @Body() create: CreateExerciseDTO,
  ): Promise<boolean> {
    return this.exerciseService.create(create, user);
  }

  /**
   * Submits changes to a specific exercise
   * @param user FHUser
   * @param id string
   * @param update CreateExerciseDTO
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('update/:id')
  async updateExercise(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: CreateExerciseDTO,
  ): Promise<boolean> {
    return this.exerciseService.submitChange(id, update, user);
  }

  /**
   * Publishes a submitted exercise
   * @param user FHUser
   * @param id string
   * @param update CreateExerciseDTO
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('publish/:id')
  async publicExercise(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: CreateExerciseDTO,
  ): Promise<boolean> {
    return this.exerciseService.publishExercise(id, update, user);
  }

  /**
   * Rejects changes to a sepcific exercise
   * @param id string
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('rejectChanges/:id')
  async rejectChanges(@Param('id') id: string): Promise<boolean> {
    return this.exerciseService.rejectChanges(id);
  }

  /**
   * Deletes an exercise submission
   * @param id string
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteExercise(@Param('id') id: string): Promise<boolean> {
    return this.exerciseService.deleteExercise(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('cancelSubmission/:id')
  async cancelSubmission(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<boolean> {
    return this.exerciseService.cancelSubmission(user, id);
  }
}
