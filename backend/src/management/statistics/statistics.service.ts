import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider } from 'src/auth/auth.service';
import { CompletedExercise } from 'src/exercise/schemas/CompletedExercise.schema';
import { Exercise } from 'src/exercise/schemas/Exercise.schema';
import { Feed } from 'src/feed/schemas/Feed.schema';
import { Friendship } from 'src/friends/schemas/Friendship.schema';
import { Message } from 'src/message/schemas/Message.schema';
import { Recipe } from 'src/recipe/schemas/Recipe.schema';
import { UserService } from 'src/user/user.service';
import { Workout } from 'src/workout/schemas/Workout.schema';
import { Variable } from '../variables/schemas/Variable.schema';
import { IGeneralStatistics } from './interfaces/IGeneralStatistics';
import { ILoginProviderStatistic } from './interfaces/ILoginProviderStatistic';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly userSerice: UserService,
    @InjectModel(Workout.name) private workoutModel: Model<Workout>,
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    @InjectModel(CompletedExercise.name)
    private completedExerciseModel: Model<CompletedExercise>,
    @InjectModel(Variable.name) private variableModel: Model<Variable>,
    @InjectModel(Feed.name) private feedModel: Model<Feed>,
  ) {}

  /**
   * returns general statistics including:
   * total user
   * total friendships
   * total messages sent
   * total workouts created
   * total exercises created
   * total recipes created
   * total exercises completed
   * total muscle types
   * total nutrition categories
   */
  async getGeneralStatistics(): Promise<IGeneralStatistics[]> {
    return [
      {
        title: 'User',
        amount: await this.userSerice.getTotalUsers(),
      },
      {
        title: 'Friendships',
        amount: await this.friendshipModel.countDocuments(),
      },
      {
        title: 'Messages',
        amount: await this.messageModel.countDocuments(),
      },
      {
        title: 'Workouts',
        amount: await this.workoutModel.countDocuments(),
      },
      {
        title: 'Exercises',
        amount: await this.exerciseModel.countDocuments(),
      },
      {
        title: 'Recipes',
        amount: await this.recipeModel.countDocuments(),
      },
      {
        title: 'Community Posts',
        amount: await this.feedModel.countDocuments(),
      },
      {
        title: 'Completed Exercises',
        amount: await this.completedExerciseModel.countDocuments(),
      },
      {
        title: 'Muskeln',
        amount: await this.variableModel
          .find({ type: 'muscle' })
          .countDocuments(),
      },
      {
        title: 'Kategorien',
        amount: await this.variableModel
          .find({ type: 'category' })
          .countDocuments(),
      },
    ];
  }

  /**
   * returns stats about login provider (shares, etc.)
   */
  async getLoginProvider(): Promise<ILoginProviderStatistic[]> {
    return Promise.all(
      Object.keys(Provider).map(async (x) => {
        return {
          provider: x,
          amount: await this.userSerice.getAmountByOAuth(Provider[x]),
        } as ILoginProviderStatistic;
      }),
    );
  }
}
