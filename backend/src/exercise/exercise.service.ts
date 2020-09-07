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
    this.sendUpdateNotifications(exercise, false, false, false);
  }

  public async publishExercise(
    id: string,
    update: UpdateExerciseDTO,
    reviewer: IUser,
  ): Promise<void> {
    await this.exerciseModel.updateOne(
      { _id: id },
      {
        $unset: { editedData: 1 },
        $set: {
          ...update,
          reviewed: true,
          reviewedBy: reviewer._id,
        },
      },
    );

    const exercise: IExercise = await this.getById(id);
    this.sendUpdateNotifications(exercise, true, false, true);
  }

  public async rejectChanges(id: string): Promise<void> {
    await this.exerciseModel.updateOne(
      { _id: id },
      { $unset: { editedData: 1 } },
    );

    const exercise: IExercise = await this.getById(id);
    this.sendUpdateNotifications(exercise, false, false, true);
  }

  public async submitChange(
    id: string,
    update: UpdateExerciseDTO,
    author: IUser,
  ): Promise<void> {
    await this.exerciseModel.updateOne(
      { _id: id, author: author._id },
      { $set: { editedData: update } },
    );

    const exercise: IExercise = await this.getById(id);
    this.sendUpdateNotifications(exercise, false, false, false);
  }

  public async deleteExercise(id: string): Promise<void> {
    const exercise = await this.exerciseModel.findOneAndDelete({ _id: id, reviewed: false });
    this.sendUpdateNotifications(exercise, false, true, true);
  }

  private async sendUpdateNotifications(
    exercise: IExercise,
    accepted: boolean,
    removeLocaly: boolean,
    removeSubmisison: boolean,
  ) {
    this.fhSocket.server
      .to(exercise.author)
      .emit('exercise' + (removeLocaly ? '.remove' : ''), exercise);

    if (accepted) {
      await this.sendMessageAsFitnessHub(exercise.author, 'exercisePublish', {
        id: exercise._id,
        title: exercise.title,
      });
    }

    const ids = await this.userService.getAllIdsExceptUser();
    const socket = this.fhSocket.server;
    ids.forEach((x) => socket.to(x));
    socket.emit(
      'exerciseSubmission' + (removeSubmisison ? '.remove' : ''),
      exercise,
    );
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
