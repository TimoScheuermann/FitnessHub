import { FormValidator } from 'src/FormValidator';
import { CreateWorkoutDTO } from './dtos/CreateWorkout.dto';

export class WorkoutFormValidator extends FormValidator {
  public static validate(dto: CreateWorkoutDTO): CreateWorkoutDTO {
    const { title } = dto;
    let { exercises } = dto;

    this.checkString(title, 'Bitte gib einen Titel für dein Workout an');
    exercises = this.checkStringArray(
      exercises,
      'Dein Workout muss mindestens eine Übung beinhalten',
    );

    return {
      exercises: exercises,
      title: title,
    };
  }
}
