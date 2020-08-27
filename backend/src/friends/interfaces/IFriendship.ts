import { IUserInfo } from 'src/user/interfaces/IUserInfo';

export interface IFriendship {
  readonly accepted: boolean;
  readonly invitee: string;
  readonly target: string;
  readonly inviteeUser?: IUserInfo;
  readonly targetUser?: IUserInfo;
}
