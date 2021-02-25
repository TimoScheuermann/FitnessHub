import { FormValidator } from 'src/FormValidator';
import { CreateExerciseDTO } from './dtos/CreateExercise.dto';

// prettier-ignore
export class ExerciseFormValidator extends FormValidator {
  public static validate(dto: CreateExerciseDTO, muscles: string[]): CreateExerciseDTO {
    const { title, thumbnail, difficulty, time, distance, sets, reps, warnings, steps } = dto;
    let { affectedMuscles } = dto;

    this.checkString(title, 'Bitte gib einen Titel an');
    this.checkString(thumbnail, 'Bitte gib ein Vorschaubild an');
    this.checkNumber(difficulty, 'Bitte gib eine Schwierigkeit an');
    this.checkNumberMinMax(difficulty, 1, 3, 'Die Schwierigkeit muss zwischen 1 und 3 liegen');

    if (!time && !distance && !sets && !reps) {
      this.throwEx('Bitte gib entweder eine Ausführungszeit, Strecke oder empfohlene Sets x Reps an');
    }

    if (time) {

      this.checkNumberMinMax(time, 1, Number.MAX_VALUE, 'Die Ausführungszeit kann nicht unter einer Sekunde liegen');

      delete dto.sets;
      delete dto.reps;
      delete dto.distance;
    } else if (distance) {

      this.checkString(distance, 'Bitte gib eine vollständige Strecken an (z.B.: 5 km)', 3);

      delete dto.sets;
      delete dto.reps;
      delete dto.time;
    } else if (reps || sets) {
      if (!(reps && sets)) {
        this.throwEx('Bitte gib eine empfohlene Menge an Sets & Reps an');
      }

      this.checkNumber(reps.min, 'Bitte gib eine minimale Anzahl an Wiederholungen an');
      this.checkNumber(reps.max, 'Bitte gib eine maximale Anzahl an Wiederholungen an');

      this.checkNumber(sets.min, 'Bitte gib eine minimale Anzahl an Sätzen an');
      this.checkNumber(sets.max, 'Bitte gib eine maximale Anzahl an Sätzen an');

      this.checkNumberMinMax(sets.min, 1, sets.max, 'Die minimale Anzahl an Sätzen muss zwischen 1 und der maximalen Anzahl (' + sets.max + ') liegen.');
      this.checkNumberMinMax(reps.min, 1, reps.max, 'Die minimale Anzahl an Wiederholungen muss zwischen 1 und der maximalen Anzahl (' + reps.max + ') liegen.');

      delete dto.time;
      delete dto.distance;
    }

    if (warnings){
      dto.warnings = warnings.filter((x) => typeof x === 'string' && x.length > 0);
      if (dto.warnings.length === 0) delete dto.warnings;
    }

    if (steps) {
      dto.steps = steps.filter((x) => typeof x === 'string' && x.length > 0);
      if (dto.steps.length === 0) delete dto.steps;
    }

    affectedMuscles = this.checkStringArray(affectedMuscles, 'Bitte gib einen Muskel an');
    affectedMuscles = this.compareStringArry(affectedMuscles, muscles, ' ist kein verfügbarer Muskel');

    return {
      ...dto,
      affectedMuscles: affectedMuscles,
    };
  }
}
