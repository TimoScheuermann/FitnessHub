import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, mongo } from 'mongoose';
import { Namespace, Server } from 'socket.io';
import { AchievementService } from 'src/achievement/achievement.service';
import { FeedService } from 'src/feed/feed.service';
import { FHSocket } from 'src/FHSocket';
import { Variable } from 'src/management/variables/schemas/Variable.schema';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/schemas/Message.schema';
import { FHBot } from 'src/user/FHBot.user';
import { IUser } from 'src/user/interfaces/IUser';
import { User } from 'src/user/schemas/User.schema';
import { CreateExerciseDTO } from './dtos/CreateExercise.dto';
import { FinishExerciseDTO } from './dtos/FinishExercise.dto';
import { ExerciseFormValidator } from './ExerciseFormValidator';
import { IExercise } from './interfaces/IExercise';
import { IExerciseShowcase } from './interfaces/IExerciseShowcase';
import { CompletedExercise } from './schemas/CompletedExercise.schema';
import { Exercise } from './schemas/Exercise.schema';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    @InjectModel(Variable.name) private variableModel: Model<Variable>,
    @InjectModel(CompletedExercise.name)
    private completedExerciseModel: Model<CompletedExercise>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly fhSocket: FHSocket,
    private readonly feedService: FeedService,
    private readonly messageService: MessageService,
    private readonly achievementService: AchievementService,
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
    if (reviewerId.length < 0) return []; // TODO: return only submission not owned by reviewerId
    return this.exerciseModel
      .find({ $or: [{ reviewed: false }, { editedData: { $exists: true } }] })
      .limit(50);
  }

  /**
   * returns an exercise by id
   * @param id string
   */
  public async getById(
    id: string,
    deleteEditedData = true,
  ): Promise<Exercise | null> {
    return (await this.getByIds([id], deleteEditedData))[0] || null;
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
      .find({ userId: userId })
      .sort({ start: -1 })
      .limit(10);

    return await this.getByIds(recent.map((x) => x.exerciseId));
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

  public async getByIds(
    ids: string[],
    deleteEditedData = true,
  ): Promise<Exercise[]> {
    const objectIds = ids.filter((x) => !!x && isValidObjectId(x));
    const unique = [...new Set(objectIds)];
    const exercises = await this.exerciseModel.find({ _id: { $in: unique } });

    const getById = (id: string): IExercise | null => {
      const ex = exercises.filter((x) => x._id.equals(id))[0];
      if (!ex) return null;
      if (deleteEditedData) delete ex.editedData;
      return ex;
    };

    return objectIds.map(getById).filter((x) => !!x) as Exercise[];
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
    create: CreateExerciseDTO,
    author: IUser,
  ): Promise<boolean> {
    const muscles = await this.getAvailableMuscles();
    create = ExerciseFormValidator.validate(create, muscles);
    const reps = this.mapSetsReps(create.reps);
    const sets = this.mapSetsReps(create.sets);

    delete create.reps;
    delete create.sets;

    const exercise = await this.exerciseModel.create({
      ...create,
      reps: reps,
      sets: sets,

      created: new Date().getTime(),
      lastExecution: 0,
      reviewedBy: '',
      reviewed: false,
      updated: -1,
      author: author._id,
    });

    this.sendUpdateNotifications(exercise, false, false, false);
    return true;
  }

  /**
   * publishes an exercise
   * @param id
   * @param update
   * @param reviewer
   */
  public async publishExercise(
    id: string,
    update: CreateExerciseDTO,
    reviewer: IUser,
  ): Promise<boolean> {
    const muscles = await this.getAvailableMuscles();
    update = ExerciseFormValidator.validate(update, muscles);
    const reps = this.mapSetsReps(update.reps);
    const sets = this.mapSetsReps(update.sets);

    delete update.reps;
    delete update.sets;

    await this.exerciseModel.findOneAndUpdate(
      { _id: id },
      {
        $unset: { editedData: true },
        $set: {
          ...update,
          reps: reps,
          sets: sets,

          updated: new Date().getTime(),
          reviewed: true,
          reviewedBy: reviewer._id,
        },
      },
    );

    const exercise = await this.getById(id);
    if (exercise) {
      this.sendUpdateNotifications(exercise, true, false, true);
      this.feedService.exerciseUpdate(exercise.toJSON());
      return true;
    }
    return false;
  }

  /**
   * reject changes of a given exercise
   * @param id
   */
  public async rejectChanges(id: string): Promise<boolean> {
    const exercise = await this.getById(id, false);
    if (exercise) {
      await exercise.updateOne({ $unset: { editedData: 1 } });
      this.sendUpdateNotifications(await this.getById(id), false, false, true);
      return true;
    }
    return false;
  }

  /**
   * submit changes to a given exercise
   * @param id
   * @param update
   * @param author
   */
  public async submitChange(
    id: string,
    update: CreateExerciseDTO,
    author: IUser,
  ): Promise<boolean> {
    const exercise = await this.getById(id, false);
    if (!exercise) {
      return false;
    }

    if (exercise.author !== author._id || !exercise.reviewed) {
      return false;
    }

    const muscles = await this.getAvailableMuscles();
    update = ExerciseFormValidator.validate(update, muscles);

    await exercise.updateOne({ $set: { editedData: update } });
    this.sendUpdateNotifications(
      await this.getById(id, false),
      false,
      false,
      false,
    );

    return true;
  }

  /**
   * deletes an exercise
   * @param id
   */
  public async deleteExercise(id: string): Promise<boolean> {
    const exercise = await this.getById(id, false);
    if (exercise && !exercise.reviewed) {
      this.sendUpdateNotifications(exercise, false, true, true);
      exercise.deleteOne();
      return true;
    }
    return false;
  }

  public async cancelSubmission(user: IUser, id: string): Promise<boolean> {
    const exercise = await this.getById(id, false);
    if (exercise) {
      if (!exercise.reviewed && exercise.author === user._id) {
        this.sendUpdateNotifications(exercise, false, true, true);
        await exercise.deleteOne();
        return true;
      }
    }
    return false;
  }

  /**
   * notifies relevant users about changes to an exercise
   * @param exercise IExercise
   * @param accepted boolean
   * @param removeLocaly boolean
   * @param removeSubmisison boolean
   */
  private async sendUpdateNotifications(
    exercise: Exercise | null,
    accepted: boolean,
    removeLocaly: boolean,
    removeSubmisison: boolean,
  ) {
    if (!exercise) return;

    this.fhSocket.server
      .to(exercise.author)
      .emit('exercise' + (removeLocaly ? '.remove' : ''), exercise);

    if (accepted) {
      await this.sendMessageAsFitnessHub(exercise.author, 'exercisePublish', {
        id: exercise._id,
        title: exercise.title,
      });
    }

    const users = await this.userModel.find({
      $or: [{ group: 'Moderator' }, { group: 'Admin' }],
    });
    const ids = users.map((x) => x._id);

    let adminSocket: Namespace | Server = this.fhSocket.server;
    ids.forEach((x) => (adminSocket = adminSocket.to(x)));

    adminSocket.emit(
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
    this.messageService.sendMessage(FHBot, to, JSON.stringify(content), type);
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
    finish = finish.map((x) => {
      const dto: any = {};
      if (!(x.exerciseId || x.duration || x.start)) {
        throw new UnprocessableEntityException(
          'Missing exerciseId, duration or start time',
        );
      }

      if (
        x.setsReps &&
        x.setsReps.length > 0 &&
        x.setsWeights &&
        x.setsWeights.length === x.setsReps.length
      ) {
        dto.setsReps = x.setsReps;
        dto.setsWeights = x.setsWeights;
      } else if (x.distances && x.distances.length > 0) {
        dto.distances = x.distances;
      } else if (x.times && x.times.length > 0) {
        dto.times = x.times;
      } else {
        throw new UnprocessableEntityException(
          'Missing reps, weights, distances or times',
        );
      }
      if (!isValidObjectId(x.exerciseId)) {
        throw new UnprocessableEntityException('Invalid exerciseId');
      }
      dto.exerciseId = x.exerciseId;
      dto.duration = x.duration;
      dto.start = x.start;
      return dto;
    });

    const now = new Date().getTime();
    const ids = [...new Set(finish.map((x) => x.exerciseId))];

    await this.completedExerciseModel.insertMany(
      finish.map((x) => {
        return {
          ...x,
          userId: user._id,
        };
      }),
    );

    const exercises = await this.exerciseModel.find({ _id: { $in: ids } });
    await Promise.all(
      exercises.map(async (x) => {
        await x.update({ $set: { lastExecution: now } });
        await this.achievementService.addExAchievement(user._id, x);
      }),
    );
  }

  /**
   * returns the most completed exercise of the last week
   */
  public async getTrendingExercises(): Promise<IExercise[]> {
    return await this.exerciseModel
      .find({ lastExecution: { $exists: true } })
      .sort({ lastExecution: -1 })
      .limit(10);
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

  private mapSetsReps(
    data: { min: number; max: number } | undefined,
  ): string | undefined {
    if (!data) return undefined;

    const { min, max } = data;
    if (min === max) return String(min);
    return min + ' - ' + max;
  }

  private async getAvailableMuscles(): Promise<string[]> {
    return (await this.variableModel.find({ type: 'muscle' })).map(
      (x) => x.title,
    );
  }
}
