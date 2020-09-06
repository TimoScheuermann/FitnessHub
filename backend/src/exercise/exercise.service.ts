import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FHSocket } from 'src/FHSocket';
import { Message } from 'src/message/schemas/Message.schema';
import { IUser } from 'src/user/interfaces/IUser';
import { UserService } from 'src/user/user.service';
import { CreateExerciseDTO } from './dtos/CreateExercise.dto';
import { UpdateExerciseDTO } from './dtos/UpdateExercise.dto';
import { IExercise } from './interfaces/IExercise';
import { Exercise } from './schemas/Exercise.schema';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly fhSocket: FHSocket,
    private readonly userService: UserService,
  ) {}

  public async getAll(): Promise<IExercise[]> {
    return this.exerciseModel.find({ reviewed: true }).limit(50);
  }

  public async getSubmissions(reviewerId: string): Promise<IExercise[]> {
    return this.exerciseModel
      .find({ $or: [{ reviewed: false }, { editedData: !undefined }] })
      .limit(50);
  }

  public async getById(id: string): Promise<Exercise> {
    return await this.exerciseModel.findById({ _id: id });
  }

  public async getByAuthor(author: string): Promise<IExercise[]> {
    return await this.exerciseModel.find({ author: author });
  }

  public async create(
    createExerciseDTO: CreateExerciseDTO,
    author: IUser,
  ): Promise<void> {
    const exercise = await this.exerciseModel.create({
      ...createExerciseDTO,
      created: new Date().getTime(),
      reviewedBy: '',
      reviewed: false,
      updated: -1,
      author: author._id,
    });

    this.fhSocket.server.to(author._id).emit('exercise', exercise);
    const ids = await this.userService.getAllIdsExceptUser();
    const socket = this.fhSocket.server;
    ids.forEach((x) => socket.to(x));
    socket.emit('exerciseSub.new', exercise);
  }

  public async publishExercise(
    id: string,
    update: UpdateExerciseDTO,
    reviewer: IUser,
  ): Promise<void> {
    await this.exerciseModel.findOne({ _id: id }).update({
      $set: {
        ...update,
        reviewed: true,
        reviewedBy: reviewer._id,
      },
    });

    const exercise: IExercise = await this.getById(id);
    if (exercise) {
      console.log(exercise);
      const ids = await this.userService.getAllIdsExceptUser();
      const socket = this.fhSocket.server;
      ids.forEach((x) => socket.to(x));
      socket.emit('exerciseSub.remove', exercise);
      this.fhSocket.server.to(exercise.author).emit('exercise', exercise);

      await this.sendMessageAsFitnessHub(exercise.author, 'exercisePublish', {
        id: exercise._id,
        title: exercise.title,
        by: reviewer,
      });
    }
  }

  public async acceptChange(
    id: string,
    reviewer: IUser,
    // eslint-disable-next-line
    update: any,
  ): Promise<void> {
    const exercise = await this.getById(id);
    if (exercise) {
      delete update._id;
      delete update.author;
      delete update.created;
      await exercise.update({
        $unset: { time: 1, distance: 1, sets: 1, reps: 1, editedData: 1 },
        $set: {
          ...update,
          reviewed: true,
          reviewedBy: reviewer._id,
          updated: new Date().getTime(),
        },
      });
      const ids = await this.userService.getAllIdsExceptUser();
      const socket = this.fhSocket.server;
      ids.forEach((x) => socket.to(x));
      socket.emit('exerciseSub.remove', exercise);
      this.fhSocket.server.to(exercise.author).emit('exercise', exercise);
      await this.sendMessageAsFitnessHub(exercise.author, 'exerciseEdit', {
        id: exercise._id,
        title: exercise.title,
        by: reviewer,
      });
    }
  }

  public async submitChange(
    id: string,
    update: UpdateExerciseDTO,
    author: IUser,
  ): Promise<IExercise> {
    const exercise = await this.exerciseModel.findOne({
      _id: id,
      author: author._id,
    });
    await exercise.update({
      $set: { editedData: update },
    });
    return exercise;
  }

  public async rejectChange(id: string): Promise<void> {
    await this.exerciseModel.findOneAndUpdate(
      { _id: id },
      { $unset: { editedData: 1 } },
    );
  }

  public async deleteOwnExercise(id: string, user: IUser): Promise<void> {
    const exercise = await this.exerciseModel.findOneAndDelete({
      _id: id,
      author: user._id,
    });
    this.broadcastDelete(exercise);
  }

  public async deleteExercise(id: string): Promise<void> {
    const exercise = await this.exerciseModel.findOneAndDelete({ _id: id });
    this.broadcastDelete(exercise);
  }

  private async broadcastDelete(exercise: Exercise): Promise<void> {
    const ids = await this.userService.getAllIdsExceptUser();
    const socket = this.fhSocket.server;
    ids.forEach((x) => socket.to(x));
    socket.emit('exerciseSub.remove', exercise);
    this.fhSocket.server.to(exercise.author).emit('exercise.remove', exercise);
  }

  private async sendMessageAsFitnessHub(
    to: string,
    type = 'message',
    // eslint-disable-next-line
    content: any,
  ): Promise<void> {
    const createdMessage: Message = await this.messageModel.create({
      date: new Date().getTime(),
      content: JSON.stringify(content),
      from: '5f4a1a372149ef521c108f4a',
      to: to,
      type: type,
      read: false,
    });

    this.fhSocket.server.to(to).emit('message', createdMessage);
  }
}
