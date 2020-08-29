import { IUserInfo } from 'src/user/interfaces/IUserInfo';

export interface IInbox {
  readonly _id?: string;
  readonly date: number;
  readonly from: IUserInfo;
  readonly message: string;
}
