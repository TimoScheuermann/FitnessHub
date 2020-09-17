export interface IVariable {
  _id?: string;
  type: 'muscle' | 'category' | 'custom';
  title: string;
  thumbnail: string;
}
