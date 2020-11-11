import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { FHSocket } from 'src/FHSocket';
import { Message } from 'src/message/schemas/Message.schema';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { UserService } from 'src/user/user.service';
import { CreateExerciseDTO } from './dtos/CreateExercise.dto';
import { FinishExerciseDTO } from './dtos/FinishExercise.dto';
import { UpdateExerciseDTO } from './dtos/UpdateExercise.dto';
import { IExercise } from './interfaces/IExercise';
import { IExerciseShowcase } from './interfaces/IExerciseShowcase';
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

  /**
   * returns all reviewed exercises
   */
  public async getAll(): Promise<IExercise[]> {
    return this.exerciseModel.find({ reviewed: true }).limit(50);
  }

  /**
   * returns all submitted exercises
   * @param reviewerId string
   */
  public async getSubmissions(reviewerId: string): Promise<IExercise[]> {
    return this.exerciseModel
      .find({ $or: [{ reviewed: false }, { editedData: !undefined }] })
      .limit(50);
  }

  /**
   * returns an exercise by id
   * @param id string
   */
  public async getById(id: string): Promise<IExercise> {
    return this.exerciseModel.findById({ _id: id });
  }

  /**
   * returns every exercise including muscle <muscle> (limit 50)
   * @param muscle string
   */
  public async getByMuscle(muscle: string): Promise<IExercise[]> {
    return this.exerciseModel
      .find({ affectedMuscles: { $all: [muscle] } })
      .limit(50);
  }

  /**
   * returns every exercise created by User XY
   * @param author string
   */
  public async getByAuthor(author: string): Promise<IExercise[]> {
    return this.exerciseModel.find({ author: author });
  }

  /**
   * returns the 10 most recent exercises, completed by user XY
   * @param userId string
   */
  public async getRecent(userId: string): Promise<IExercise[]> {
    const recent = await this.completedExerciseModel
      .find({ user: userId })
      .sort({ start: -1 })
      .limit(10);
    return Promise.all(recent.map(async (x) => await this.getById(x.exercise)));
  }

  /**
   * gathers more informations about exercises included in the input list
   * @param ids string[]
   */
  public async getShowcases(ids: string[]): Promise<IExerciseShowcase[]> {
    const exercises = await this.exerciseModel.find({
      _id: { $in: ids.map((x) => new mongo.ObjectID(x)) },
    });
    const getType = (exercises: IExercise): 'time' | 'distance' | 'gym' => {
      if (exercises.reps) return 'gym';
      if (exercises.distance) return 'distance';
      return 'time';
    };
    return exercises.map((x) => {
      return {
        _id: x._id,
        thumbnail: x.thumbnail,
        title: x.title,
        type: getType(x),
      } as IExerciseShowcase;
    });
  }

  /**
   * returns every exercise containing a given query (limit 50)
   * @param query string
   */
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

  /**
   * creates an exercise
   * @param createExerciseDTO
   * @param author
   */
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

  /**
   * publishes an exercise
   * @param id
   * @param update
   * @param reviewer
   */
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
          updated: new Date().getTime(),
          reviewed: true,
          reviewedBy: reviewer._id,
        },
      },
    );

    const exercise: IExercise = await this.getById(id);
    this.sendUpdateNotifications(exercise, true, false, true);
  }

  /**
   * reject changes of a given exercise
   * @param id
   */
  public async rejectChanges(id: string): Promise<void> {
    await this.exerciseModel.updateOne(
      { _id: id },
      { $unset: { editedData: 1 } },
    );

    const exercise: IExercise = await this.getById(id);
    this.sendUpdateNotifications(exercise, false, false, true);
  }

  /**
   * submit changes to a given exercise
   * @param id
   * @param update
   * @param author
   */
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

  /**
   * deletes an exercise
   * @param id
   */
  public async deleteExercise(id: string): Promise<void> {
    const exercise = await this.exerciseModel.findOneAndDelete({
      _id: id,
      reviewed: false,
    });
    this.sendUpdateNotifications(exercise, false, true, true);
  }

  /**
   * notifies relevant users about changes to an exercise
   * @param exercise IExercise
   * @param accepted boolean
   * @param removeLocaly boolean
   * @param removeSubmisison boolean
   */
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

  /**
   * sends a message [sender disguised as FitnessHub] to a User
   * @param to
   * @param type
   * @param content
   */
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

  /**
   * stores a completed exercise to the db
   * @param user
   * @param finish
   */
  public async finished(
    user: IUser,
    finish: FinishExerciseDTO[],
  ): Promise<void> {
    const transformed = finish.map((x) => {
      return { ...x, user: user._id };
    });
    await this.completedExerciseModel.insertMany(transformed);
    // TODO: Inform friends?
  }

  /**
   * returns the most completed exercise of the last week
   */
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

  /**
   * returns the latest created exercises (limit 10)
   */
  public async getLatestExercises(): Promise<IExercise[]> {
    return await this.exerciseModel
      .find({ reviewed: true })
      .sort({ created: -1 })
      .limit(10);
  }
}
