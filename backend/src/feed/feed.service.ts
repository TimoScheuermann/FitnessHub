import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { FHSocket } from 'src/FHSocket';
import { IUserInfo } from 'src/user/interfaces/IUserInfo';
import { User } from 'src/user/schemas/User.schema';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { FeedValidator } from './FeedValidator';
import { IFeed } from './interfaces/IFeed.interface';
import { Feed } from './schemas/Feed.schema';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly fhSocket: FHSocket,
  ) {}

  public async getFeed(oldest?: number): Promise<IFeed[]> {
    let posts: Feed[] = [];

    if (oldest && !isNaN(+oldest)) {
      posts = await this.feedModel
        .find()
        .sort({ timestamp: -1 })
        .find({ timestamp: { $lt: +oldest } })
        .limit(5);
    } else {
      posts = await this.feedModel.find().sort({ timestamp: -1 }).limit(5);
    }

    posts = posts.map((x) => x.toJSON());

    return this.mapPost(posts);
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

  private async mapPost(posts: Feed[]): Promise<IFeed[]> {
    if (posts.length === 0 || !posts) return [];

    const userIds = [...new Set(posts.map((x) => x.user).filter((x) => !!x))];
    let users = [];
    if (userIds.length > 0) {
      users = await this.userModel.find({ _id: { $in: [userIds] } });
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
      return { ...x, user: getUser(x.user) } as IFeed;
    });
  }
}
