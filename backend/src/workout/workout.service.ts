import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { IExercise } from 'src/exercise/interfaces/IExercise';
import { IExerciseInfo } from 'src/exercise/interfaces/IExerciseInfo';
import { Exercise } from 'src/exercise/schemas/Exercise.schema';
import { Trainingplan } from 'src/trainingplan/schemas/Trainingplan.schema';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateWorkoutDTO } from './dtos/CreateWorkout.dto';
import { IWorkout } from './interfaces/IWorkout';
import { Workout } from './schemas/Workout.schema';
import { WorkoutFormValidator } from './WorkoutFormValidator';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<Workout>,
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    @InjectModel(Trainingplan.name)
    private trainingplanModel: Model<Trainingplan>,
  ) {}

  /**
   * Returns workouts of specific user
   * @param user author
   */
  public async getWorkouts(user: IUser): Promise<IWorkout[]> {
    const workouts: Workout[] = await this.workoutModel.find({
      author: user._id,
    });

    return await this.mapWorkouts(workouts);
  }

  /**
   * Returns latest 10 workouts
   */
  public async getLatestWorkouts(): Promise<IWorkout[]> {
    const workouts: Workout[] = await this.workoutModel
      .find({ updated: { $exists: true }, 'exercises.1': { $exists: true } })
      .sort({ updated: -1 })
      .limit(10);

    return await this.mapWorkouts(workouts);
  }

  /**
   * Returns workout with specific id
   * @param id workoutId
   */
  public async getById(id: string): Promise<IWorkout> {
    const workout = await this.workoutModel.findById(id);
    if (workout) {
      return (await this.mapWorkouts([workout]))[0];
    }
    return null;
  }

  /**
   * Creates new workout
   * @param user author
   * @param createWorkoutDTO new workout
   */
  public async createWorkout(
    user: IUser,
    dto: CreateWorkoutDTO,
  ): Promise<IWorkout> {
    dto = WorkoutFormValidator.validate(dto);

    const workout = await this.workoutModel.create({
      ...dto,
      author: user._id,
      updated: new Date().getTime(),
    });

    return (await this.mapWorkouts([workout]))[0];
  }

  /**
   * Updates workout with specific author and id
   * @param user author
   * @param id workoutId
   * @param workoutDTO updated workout
   */
  public async updateWorkout(
    user: IUser,
    id: string,
    dto: CreateWorkoutDTO,
  ): Promise<IWorkout> {
    dto = WorkoutFormValidator.validate(dto);

    await this.workoutModel.updateOne(
      { author: user._id, _id: id },
      {
        $set: {
          ...dto,
          updated: new Date().getTime(),
        },
      },
    );

    const workout = await this.workoutModel.findOne({
      _id: id,
      author: user._id,
    });

    return (await this.mapWorkouts([workout]))[0];
  }

  /**
   * Deletes workout with specific author and id
   * @param user author
   * @param id workoutId
   */
  public async deleteWorkout(user: IUser, id: string): Promise<void> {
    const workout = await this.workoutModel.findOne({
      _id: id,
      author: user._id,
    });
    if (!workout) return;

    await this.workoutModel.deleteOne({ _id: id, author: user._id });

    for (let i = 0; i < 7; i++) {
      const object = {};
      object[i] = id;
      await this.trainingplanModel.update(
        { author: user._id, ...object },
        { $unset: object },
      );
    }
  }

  private async mapWorkouts(workouts: Workout[]): Promise<IWorkout[]> {
    const uniqueIds = [
      ...new Set([].concat(...workouts.map((x) => x.exercises))),
    ].filter((x) => x && isValidObjectId(x));

    const exercises = await this.exerciseModel.find({
      _id: { $in: uniqueIds },
    });

    const getExercise = (id: string): Exercise | null => {
      return exercises.filter((x) => x._id == id)[0] || null;
    };

    const getExerciseInfo = (ex: IExercise | null): IExerciseInfo | null => {
      if (!ex) return null;
      return {
        affectedMuscles: ex.affectedMuscles,
        difficulty: ex.difficulty,
        thumbnail: ex.thumbnail,
        title: ex.title,
        type: ex.distance ? 'distance' : ex.sets ? 'gym' : 'time',
        _id: ex._id,
      };
    };

    return workouts.map((x) => {
      return {
        author: x.author,
        exercises: x.exercises
          .map((e) => getExerciseInfo(getExercise(e)))
          .filter((x) => !!x),
        title: x.title,
        updated: x.updated,
        _id: x._id,
      };
    });
  }
}
