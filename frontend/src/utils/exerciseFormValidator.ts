import { aHour, aMinute } from './constants';
import { CreateExerciseDTO } from './dtos';
import { sendNotification } from './functions';

function notifiy(missing: string, info: string) {
  sendNotification({
    title: 'Fehlende Angabe: ' + missing,
    text: info
  });
}

export function validate(
  exercise: CreateExerciseDTO,
  selectedCategorie: number,
  setsMin: number,
  setsMax: number,
  repsMin: number,
  repsMax: number,
  timeUnit: string | null
): CreateExerciseDTO | null {
  // check title
  if (exercise.title.length === 0) {
    notifiy('Name', 'Bitte trage einen Namen für die Übung ein');
    return null;
  }

  // check thumbnail
  if (exercise.thumbnail.length === 0) {
    notifiy('Thumbnail', 'Bitte füge einen Link zu einem Bild der Übung hinzu');
    return null;
  }

  // check muscle length
  if (exercise.affectedMuscles.length === 0) {
    notifiy(
      'Betroffene Muskeln',
      'Bitte wähle mindestens einen betroffenen Muskel aus'
    );
    return null;
  }

  // check categories (sets & reps, time, distance)
  // sets & reps
  if (selectedCategorie === 0) {
    if (Math.min(setsMin, setsMax, repsMax, repsMin) <= 0) {
      notifiy('Sätze / Wiederholungen', 'Die Angaben müssen größer als 0 sein');
      return null;
    }
    if (setsMax < setsMin || repsMax < repsMin) {
      notifiy(
        'Sätze / Wiederholungen',
        'Die mindest Anzahl darf nicht größer sein, als die maximale Anzahl'
      );
      return null;
    }
  }
  // time
  if (selectedCategorie === 1) {
    if (!timeUnit) {
      notifiy('Zeiteinheit', 'Bitte wähle eine Zeiteinheit aus');
      return null;
    }
    if ((exercise.time || 0) <= 0) {
      notifiy(
        'Dauer',
        'Die Dauer der Übung muss mindestens eine Zeiteinheit beanspruchen'
      );
      return null;
    }
  }
  // distance
  if (selectedCategorie === 2 && (exercise.distance || '').length === 0) {
    notifiy('Strecke', 'Bitte fülle dieses Feld aus');
    return null;
  }

  const createObject: CreateExerciseDTO = {
    title: exercise.title,
    affectedMuscles: exercise.affectedMuscles,
    thumbnail: exercise.thumbnail,
    difficulty: +exercise.difficulty,
    warnings: exercise.warnings,
    steps: exercise.steps,
    possibleAtHome: exercise.possibleAtHome
  };
  if ((exercise.explanatoryVideo || '').length > 0) {
    createObject.explanatoryVideo = exercise.explanatoryVideo;
  }
  if (selectedCategorie === 0) {
    createObject.sets = setsMin + ' - ' + setsMax;
    createObject.reps = repsMin + ' - ' + repsMax;
  } else if (selectedCategorie === 1) {
    createObject.time =
      (exercise.time || 1) *
      (timeUnit === 'Minute(n)'
        ? aMinute / 1000
        : timeUnit === 'Stunde(n)'
        ? aHour / 1000
        : 1);
  } else if (selectedCategorie === 2) {
    createObject.distance = exercise.distance;
  }
  return createObject;
}

export const defaultExercise: CreateExerciseDTO = {
  title: '',
  thumbnail: '',
  explanatoryVideo: '',
  affectedMuscles: [],
  time: 20,
  distance: '5 km',
  sets: '',
  reps: '',
  difficulty: 1,
  warnings: [],
  steps: [],
  possibleAtHome: false
};
