import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { IExercise } from 'src/exercise/interfaces/IExercise';
import { FHSocket } from 'src/FHSocket';
import { Friendship } from 'src/friends/schemas/Friendship.schema';
import { IRecipe } from 'src/recipe/interfaces/IRecipe';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUserInfo } from 'src/user/interfaces/IUserInfo';
import { User } from 'src/user/schemas/User.schema';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { FeedValidator } from './FeedValidator';
import { IFeed } from './interfaces/IFeed.interface';
import { Feed } from './schemas/Feed.schema';

const VALID_REACTIONS = ['hot', 'like', 'strong', 'thumbsup', 'monkey'];
const RECIPE_CREATE_TEXT = 'Ich habe ein neues Rezept veröffentlicht!';
const EXERCISE_CREATE_TEXT = 'Ich habe eine neue Übung veröffentlicht!';
@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Friendship.name)
    private readonly friendshipModel: Model<Friendship>,
    private readonly fhSocket: FHSocket,
    private readonly tgbotService: TgbotService,
  ) {}

  public async getFeed(
    oldest?: number,
    limit?: number,
    userId?: string,
  ): Promise<IFeed[]> {
    if (!limit || isNaN(+limit)) limit = 20;
    else limit = +limit;

    if (!oldest || isNaN(+oldest)) oldest = new Date().getTime();
    else oldest = +oldest;

    let posts = [];
    if (!userId) {
      posts = await this.feedModel
        .find({
          timestamp: { $lt: oldest },
          achievementTitle: { $exists: false },
        })
        .sort({ timestamp: -1 })
        .limit(limit);
    } else {
      const friends = await this.getFriendsOf(userId);
      friends.push(userId);
      posts = await this.feedModel
        .find({
          timestamp: { $lt: oldest },
          $or: [
            { achievementTitle: { $exists: false } },
            {
              $and: [
                { achievementTitle: { $exists: true } },
                { user: { $in: friends } },
              ],
            },
          ],
        })
        .sort({ timestamp: -1 })
        .limit(limit);
    }
    return this.mapPost(posts, userId || null);
  }

  public async getPost(id: string): Promise<Feed> {
    if (!id || !isValidObjectId(id)) {
      throw new UnprocessableEntityException('Invalid postId');
    }

    const feed = await this.feedModel.findOne({ _id: id });

    if (!feed) {
      throw new NotFoundException("Post doesn't exist");
    }
    return feed;
  }

  public async patchPost(id: string, dto: CreatePostDto): Promise<boolean> {
    if (
      !id ||
      !isValidObjectId(id) ||
      !(await this.feedModel.findOne({ _id: id }))
    ) {
      FeedValidator.throwEx('Fehlerhafte oder unbekannte postId');
    }

    dto = FeedValidator.validate(dto);

    await this.feedModel.updateOne({ _id: id }, { $set: dto });

    const feed = await this.feedModel.findOne({ _id: id });
    const post = (await this.mapPost([feed]))[0];

    this.fhSocket.server.emit('feed-updated', post);
    return true;
  }

  public async deletePost(id: string): Promise<boolean> {
    if (!id || !isValidObjectId(id)) return false;
    await this.feedModel.deleteOne({ _id: id, user: { $exists: false } });
    return true;
  }

  public async createPost(dto: CreatePostDto): Promise<boolean> {
    dto = FeedValidator.validate(dto);
    const feed = await this.feedModel.create({
      ...dto,
      timestamp: new Date().getTime(),
    });
    const post = (await this.mapPost([feed]))[0];

    this.fhSocket.server.emit('feed-created', post);
    return true;
  }

  public async exerciseUpdate(e: IExercise): Promise<void> {
    await this.feedModel.updateMany(
      { exerciseId: e._id },
      { $set: { thumbnail: e.thumbnail, title: e.title } },
    );
    const feed = await this.feedModel.find({ exerciseId: e._id });
    (await this.mapPost(feed)).forEach((x) => {
      this.fhSocket.server.emit('feed-update', x);
    });

    // exercise didnt exist before
    if (
      !(await this.feedModel.findOne({
        text: EXERCISE_CREATE_TEXT,
        title: e.title,
      }))
    ) {
      const newFeed = await this.feedModel.create({
        text: EXERCISE_CREATE_TEXT,
        timestamp: new Date().getTime(),
        exerciseId: e._id,
        thumbnail: e.thumbnail,
        title: e.title,
        user: e.author,
      });
      const mapped = (await this.mapPost([newFeed]))[0];
      this.fhSocket.server.emit('feed-create', mapped);

      this.tgbotService.publishUpdate(
        'Eine neue Übung wurde veröffentlicht!\n<b>' + e.title + '</b>',
        'Übung ansehen',
        'https://fitnesshub.app/e/' + e._id,
        e.thumbnail,
      );
    }
  }

  public async recipeUpdate(r: IRecipe): Promise<void> {
    await this.feedModel.updateMany(
      { recipeId: r._id },
      { $set: { thumbnail: r.thumbnail, title: r.title } },
    );
    const feed = await this.feedModel.find({ recipeId: r._id });
    (await this.mapPost(feed)).forEach((x) => {
      this.fhSocket.server.emit('feed-update', x);
    });
  }

  public async recipeCreated(r: IRecipe): Promise<void> {
    const newFeed = await this.feedModel.create({
      text: RECIPE_CREATE_TEXT,
      timestamp: new Date().getTime(),
      recipeId: r._id,
      thumbnail: r.thumbnail,
      title: r.title,
      user: r.author,
    });
    const mapped = (await this.mapPost([newFeed]))[0];
    this.fhSocket.server.emit('feed-create', mapped);

    this.tgbotService.publishUpdate(
      'Ein neues Rezept wurde veröffentlicht!\n<b>' + r.title + '</b>',
      'Rezept ansehen',
      'https://fitnesshub.app/r/' + r._id,
      r.thumbnail,
    );
  }

  public async recipeDelete(id: string): Promise<void> {
    await this.feedModel.deleteMany({ recipeId: id });
  }

  public async addReaction(
    feedId: string,
    type: string,
    userId: string,
  ): Promise<void> {
    if (!feedId || !isValidObjectId(feedId)) return;
    if (!VALID_REACTIONS.includes(type)) return;
    if (!(await this.feedModel.findOne({ _id: feedId }))) return;

    const object = {};
    object[type] = userId;

    await this.feedModel.updateOne(
      { _id: feedId },
      { $addToSet: object },
      { upsert: true },
    );
  }
  public async removeReaction(
    feedId: string,
    type: string,
    userId: string,
  ): Promise<void> {
    if (!feedId || !isValidObjectId(feedId)) return;
    if (!VALID_REACTIONS.includes(type)) return;
    if (!(await this.feedModel.findOne({ _id: feedId }))) return;

    const object = {};
    object[type] = userId;

    await this.feedModel.updateOne(
      { _id: feedId },
      { $pull: object },
      { upsert: true },
    );
  }

  private async mapPost(
    posts: Feed[],
    userId: string | null = null,
  ): Promise<IFeed[]> {
    if (posts.length === 0 || !posts) return [];

    const userIds = [...new Set(posts.map((x) => x.user).filter((x) => !!x))];

    let users = [];
    if (userIds.length > 0) {
      users = await this.userModel.find({ _id: { $in: userIds } });
    }

    const getUser = (id?: string): IUserInfo | undefined => {
      if (!id) return undefined;
      const user = users.filter((x) => x._id == id)[0];
      if (!user) return undefined;
      return {
        _id: user._id,
        avatar: user.avatar,
        username: [user.givenName, user.familyName]
          .filter((x) => !!x)
          .join(' '),
      };
    };

    return posts.map((x) => {
      let { hot, like, strong, thumbsup, monkey } = x;
      hot = hot || [];
      like = like || [];
      strong = strong || [];
      thumbsup = thumbsup || [];
      monkey = monkey || [];

      const reactions: string[] = [];
      if (userId) {
        if (hot.includes(userId)) reactions.push('hot');
        if (like.includes(userId)) reactions.push('like');
        if (strong.includes(userId)) reactions.push('strong');
        if (thumbsup.includes(userId)) reactions.push('thumbsup');
        if (monkey.includes(userId)) reactions.push('monkey');
      }

      return {
        ...x.toJSON(),
        user: getUser(x.user),
        hot: hot.length,
        like: like.length,
        strong: strong.length,
        thumbsup: thumbsup.length,
        monkey: monkey.length,
        reactions: reactions,
      } as IFeed;
    });
  }

  private async getFriendsOf(id: string): Promise<string[]> {
    const friends = await this.friendshipModel.find({
      $or: [
        { invitee: id, accepted: true },
        { target: id, accepted: true },
      ],
    });

    const idPairs = friends.map((x) => [x.invitee, x.target]);
    const uniqueIds = [...new Set([].concat(...idPairs))];
    return uniqueIds.filter((x) => isValidObjectId(x));
  }
}
