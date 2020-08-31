export interface IFriendship {
  readonly _id: string;
  readonly accepted: boolean;
  readonly invitee: string;
  readonly target: string;
}
