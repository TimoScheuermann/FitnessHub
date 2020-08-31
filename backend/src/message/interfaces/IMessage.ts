export interface IMessage {
  readonly _id?: string;
  readonly type: string;
  readonly date: number;
  readonly from: string;
  readonly to: string;
  readonly read: boolean;
  readonly content: string;
}
