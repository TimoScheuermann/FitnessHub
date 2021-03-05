import { openFullscreen } from './functions';
import { IExercise, IExerciseInfo } from './interfaces';
import { UserManagement } from './UserManagement';

export class WorkoutManagement {
  public static startWorkout(exercises: (IExercise | IExerciseInfo)[]) {
    if (!UserManagement.getUser()) {
      openFullscreen('login');
    } else if (exercises && exercises.length > 0) {
      console.log(exercises);
    }
  }
}
