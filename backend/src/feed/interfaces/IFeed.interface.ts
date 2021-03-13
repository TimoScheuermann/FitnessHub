import { IUserInfo } from 'src/user/interfaces/IUserInfo';

export interface IFeed {
  _id: string;
  user?: IUserInfo;
  timestamp: number;
  thumbnail?: string;
  title?: string;
  text: string;
  recipeId?: string;
  exerciseId?: string;
  achievementTitle?: string;

  hot: number;
  like: number;
  strong: number;
  thumbsup: number;
  monkey: number;
  reactions: string[];
}
