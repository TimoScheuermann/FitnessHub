import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FHSocket } from 'src/FHSocket';
import { Message } from 'src/message/schemas/Message.schema';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { UserService } from 'src/user/user.service';
import { CreateExerciseDTO } from './dtos/CreateExercise.dto';
import { FinishExerciseDTO } from './dtos/FinishExercise.dto';
import { UpdateExerciseDTO } from './dtos/UpdateExercise.dto';
import { IExercise } from './interfaces/IExercise';
import { CompletedExercise } from './schemas/CompletedExercise.schema';
import { Exercise } from './schemas/Exercise.schema';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    @InjectModel(CompletedExercise.name)
    private completedExerciseModel: Model<CompletedExercise>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly tgbotService: TgbotService,
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

  public async getById(id: string): Promise<IExercise> {
    return this.exerciseModel.findById({ _id: id });
  }

  public async getByMuscle(muscle: string): Promise<IExercise[]> {
    return this.exerciseModel
      .find({ affectedMuscles: { $all: [muscle] } })
      .limit(50);
  }

  public async getByAuthor(author: string): Promise<IExercise[]> {
    return this.exerciseModel.find({ author: author });
  }

  public async find(query: string): Promise<IExercise[]> {
    const reg = new RegExp(`${query}`, 'i');
    return this.exerciseModel
      .find({
        $or: [
          { title: reg },
          { affectedMuscles: { $all: [reg] } },
          { warnings: { $all: [reg] } },
          { steps: { $all: [reg] } },
        ],
      })
      .limit(50);
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
    delete (update as any).editedData;
    await this.exerciseModel.updateOne(
      { _id: id },
      {
        $unset: { editedData: true },
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
      { $set: { editedData: update, updated: new Date().getTime() } },
    );

    const exercise: IExercise = await this.getById(id);
    this.sendUpdateNotifications(exercise, false, false, false);
  }

  public async deleteExercise(id: string): Promise<void> {
    const exercise = await this.exerciseModel.findOneAndDelete({
      _id: id,
      reviewed: false,
    });
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

  public async finished(user: IUser, finish: FinishExerciseDTO): Promise<void> {
    await this.completedExerciseModel.create({
      user: user._id,
      exercise: finish.exercise,
      end: finish.end,
      start: finish.start,
      distance: finish.distance,
      sets: finish.sets,
    });
    // TODO: Inform friends?
  }

  public async getTrendingExercises(): Promise<IExercise[]> {
    const weekStart = new Date().getTime() - 1000 * 60 * 60 * 24 * 7; // a week before
    const finished = await this.completedExerciseModel
      .aggregate([
        { $match: { start: { $gte: weekStart } } },
        { $sortByCount: '$exercise' },
      ])
      .sort({ count: -1 });

    return Promise.all(finished.map(async (x) => await this.getById(x._id)));
  }

  public async getLatestExercises(): Promise<IExercise[]> {
    return await this.exerciseModel
      .find()
      .sort({ updated: -1, created: -1 })
      .limit(10)
      .sort({ updated: 1, created: 1 });
  }
}
