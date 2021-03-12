import { CreateExerciseDTO } from '../dtos/CreateExercise.dto';

export interface IExercise {
  _id?: string;

  author: string;
  reviewed: boolean;
  reviewedBy: string;
  created: number;
  updated: number;
  lastExecution: number;

  title: string;
  thumbnail: string;
  difficulty: number;
  affectedMuscles: string[];

  explanatoryVideo?: string;
  warnings?: string[];
  steps?: string[];

  possibleAtHome?: boolean;
  kneeFriendly?: boolean;

  editedData?: CreateExerciseDTO;

  time?: number;
  distance?: string;
  sets?: string;
  reps?: string;
}
