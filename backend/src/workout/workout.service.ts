import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IExercise } from 'src/exercise/interfaces/IExercise';
import { IExerciseInfo } from 'src/exercise/interfaces/IExerciseInfo';
import { Exercise } from 'src/exercise/schemas/Exercise.schema';
import { FHSocket } from 'src/FHSocket';
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
  ) {}

  public async getWorkouts(user: IUser): Promise<IWorkout[]> {
    const workouts: Workout[] = await this.workoutModel.find({
      author: user._id,
    });
    return Promise.all(workouts.map(async (x) => this.mapWorkoutToInfo(x)));
  }

  private async mapWorkoutToInfo(workout: Workout): Promise<IWorkout> {
    return {
      _id: workout._id,
      author: workout.author,
      title: workout.title,
      exercises: await Promise.all(
        workout.exercises.map(async (x) => await this.getExerciseInfoById(x)),
      ),
    };
  }

  public async createWorkout(
    user: IUser,
    createWorkoutDTO: CreateWorkoutDTO,
  ): Promise<void> {
    console.log('creating', createWorkoutDTO);
    console.log('for', user.givenName, user.familyName);
    const workout = await this.workoutModel.create({
      author: user._id,
      exercises: createWorkoutDTO.exercises,
      title: createWorkoutDTO.title,
    });
    const info = await this.mapWorkoutToInfo(workout);
    this.fhSocket.server.to(user._id).emit('workout', info);
  }

  public async updateWorkout(
    user: IUser,
    id: string,
    workoutDTO: CreateWorkoutDTO,
  ): Promise<void> {
    await this.workoutModel.updateOne(
      { author: user._id, _id: id },
      { $set: { exercises: workoutDTO.exercises, title: workoutDTO.title } },
    );
    const workout = await this.workoutModel.findOne({
      _id: id,
      author: user._id,
    });
    const info = await this.mapWorkoutToInfo(workout);
    this.fhSocket.server.to(user._id).emit('workout', info);
  }

  public async deleteWorkout(user: IUser, id: string): Promise<void> {
    await this.workoutModel.deleteOne({ _id: id, author: user._id });
    this.fhSocket.server.to(user._id).emit('workout.remove', id);
  }

  public async getExerciseInfoById(id: string): Promise<IExerciseInfo> {
    const exercise: IExercise = await this.exerciseModel.findById(id);
    return {
      _id: exercise._id,
      thumbnail: exercise.thumbnail,
      title: exercise.title,
    };
  }
}