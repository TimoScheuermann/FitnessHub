import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IExercise } from 'src/exercise/interfaces/IExercise';
import { IExerciseInfo } from 'src/exercise/interfaces/IExerciseInfo';
import { Exercise } from 'src/exercise/schemas/Exercise.schema';
import { FHSocket } from 'src/FHSocket';
import { Trainingplan } from 'src/trainingplan/schemas/Trainingplan.schema';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateWorkoutDTO } from './dtos/CreateWorkout.dto';
import { IWorkout } from './interfaces/IWorkout';
import { Workout } from './schemas/Workout.schema';

@Injectable()
export class WorkoutService {
  constructor(
    private readonly fhSocket: FHSocket,
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
    return Promise.all(workouts.map(async (x) => this.mapWorkoutToInfo(x)));
  }

  /**
   * Returns latest 10 workouts
   */
  public async getLatestWorkouts(): Promise<IWorkout[]> {
    const workouts: Workout[] = await this.workoutModel
      .find({ updated: { $exists: true }, 'exercises.1': { $exists: true } })
      .sort({ updated: -1 })
      .limit(10);
    return Promise.all(workouts.map(async (x) => this.mapWorkoutToInfo(x)));
  }

  /**
   * Returns workout with specific id
   * @param id workoutId
   */
  public async getById(id: string): Promise<IWorkout> {
    const workout = await this.workoutModel.findById(id);
    if (workout) {
      const exercises: IExerciseInfo[] = await Promise.all(
        workout.exercises.map(async (x) => await this.getExerciseInfoById(x)),
      );
      return {
        author: workout.author,
        exercises: exercises,
        title: workout.title,
        updated: workout.updated,
        _id: workout._id,
      };
    }
    return null;
  }

  /**
   * Replaces exerciseId with full exercise info
   * @param workout specific workout
   */
  private async mapWorkoutToInfo(workout: Workout): Promise<IWorkout> {
    return {
      _id: workout._id,
      updated: workout.updated,
      author: workout.author,
      title: workout.title,
      exercises: await Promise.all(
        workout.exercises.map(async (x) => await this.getExerciseInfoById(x)),
      ),
    };
  }

  /**
   * Creates new workout
   * @param user author
   * @param createWorkoutDTO new workout
   */
  public async createWorkout(
    user: IUser,
    createWorkoutDTO: CreateWorkoutDTO,
  ): Promise<void> {
    const workout = await this.workoutModel.create({
      author: user._id,
      exercises: createWorkoutDTO.exercises,
      title: createWorkoutDTO.title,
      updated: new Date().getTime(),
    });
    const info = await this.mapWorkoutToInfo(workout);
    this.fhSocket.server.to(user._id).emit('workout', info);
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
    workoutDTO: CreateWorkoutDTO,
  ): Promise<void> {
    await this.workoutModel.updateOne(
      { author: user._id, _id: id },
      {
        $set: {
          exercises: workoutDTO.exercises,
          title: workoutDTO.title,
          updated: new Date().getTime(),
        },
      },
    );
    const workout = await this.workoutModel.findOne({
      _id: id,
      author: user._id,
    });
    const info = await this.mapWorkoutToInfo(workout);
    this.fhSocket.server.to(user._id).emit('workout', info);
  }

  /**
   * Deletes workout with specific author and id
   * @param user author
   * @param id workoutId
   */
  public async deleteWorkout(user: IUser, id: string): Promise<void> {
    this.fhSocket.server.to(user._id).emit('workout.remove', id);
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

  /**
   * Returns info of exercise with specific id
   * @param id exerciseId
   */
  public async getExerciseInfoById(id: string): Promise<IExerciseInfo> {
    const exercise: IExercise = await this.exerciseModel.findById(id);
    return {
      _id: exercise._id,
      thumbnail: exercise.thumbnail,
      title: exercise.title,
      difficulty: exercise.difficulty,
      type: exercise.distance ? 'distance' : exercise.sets ? 'gym' : 'time',
      affectedMuscles: exercise.affectedMuscles,
    };
  }
}
