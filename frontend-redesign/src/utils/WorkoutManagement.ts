import backend from './backend';
import { FinishExerciseDTO } from './dtos';
import { closeFullscreen, openFullscreen } from './functions';
import { IExerciseInfo } from './interfaces';
import { TrainingStatistics } from './Trainingstatistics';
import { UserManagement } from './UserManagement';

export interface WorkoutStats {
  exerciseId: string;
  duration: number;
  start: number;
  reps: number[];
  weights: number[];
  distance: number;
  time: number;
}
export class WorkoutManagement {
  private static lsStats = 'fh-running-workout-st';
  private static lsExerc = 'fh-running-workout-ex';
  private static lsStartTS = 'fh-running-workout-ts';

  private static strf(item: number | IExerciseInfo[] | WorkoutStats[]): string {
    return JSON.stringify(item);
  }

  public static startWorkout(exercises: IExerciseInfo[]) {
    if (!UserManagement.getUser()) {
      openFullscreen('login');
    } else if (exercises && exercises.length > 0) {
      localStorage.setItem(this.lsStartTS, new Date().getTime().toString());
      localStorage.setItem(this.lsExerc, this.strf(exercises));
      this.prepareStats(exercises);
      this.openView();
    }
  }

  public static prepareStats(exercises: IExerciseInfo[]): void {
    const stats: WorkoutStats[] = exercises.map(x => {
      return {
        exerciseId: x._id,
        start: -1,
        duration: 0,
        reps: [],
        weights: [],
        distance: -1,
        time: -1
      };
    });
    localStorage.setItem(this.lsStats, this.strf(stats));
  }

  private static openView(): void {
    openFullscreen('run-workout');
  }

  public static hasActiveWorkout(): boolean {
    return (
      !!localStorage.getItem(this.lsStartTS) &&
      !!localStorage.getItem(this.lsExerc) &&
      !!localStorage.getItem(this.lsStats)
    );
  }

  public static checkActive(): void {
    if (this.hasActiveWorkout()) {
      this.openView();
    }
  }

  public static clearActiveWorkout(): void {
    localStorage.removeItem(this.lsStartTS);
    localStorage.removeItem(this.lsExerc);
    localStorage.removeItem(this.lsStats);
    closeFullscreen('workouts');
  }

  public static saveStats(stats: WorkoutStats[]): void {
    localStorage.setItem(this.lsStats, this.strf(stats));
  }

  public static getStartTime(): number {
    return +(localStorage.getItem(this.lsStartTS) || 0);
  }

  public static getStats(): WorkoutStats[] {
    return JSON.parse(localStorage.getItem(this.lsStats) || '[]');
  }

  public static getExercises(): IExerciseInfo[] {
    return JSON.parse(localStorage.getItem(this.lsExerc) || '[]');
  }

  public static saveWorkout(stats: WorkoutStats[]): void {
    const dto: FinishExerciseDTO[] = stats
      .map(x => {
        const d: FinishExerciseDTO = {
          duration: x.duration,
          exercise: x.exerciseId,
          start: this.getStartTime()
        };
        if (x.reps.length > 0) {
          d.setsReps = x.reps;
          d.setsWeights = x.weights;
        } else if (x.distance > 0) {
          d.distances = [x.distance];
        } else if (x.time > 0) {
          d.times = [x.time];
        } else {
          return null;
        }
        return d;
      })
      .filter(x => !!x) as FinishExerciseDTO[];

    backend.post('exercise/finished', dto);
    this.clearActiveWorkout();
    TrainingStatistics.loadCharts();
  }
}
