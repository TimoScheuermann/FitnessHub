import { IUserInfo } from 'src/user/interfaces/IUserInfo';

export interface IPendingFriendship {
  _id: string;
  invitee: IUserInfo;
  target: IUserInfo;
}
