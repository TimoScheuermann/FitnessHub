import store from '@/store';
import backend from './backend';
import { IExercise } from './interfaces';
import { UserManagement } from './UserManagement';

export class ExerciseManagement {
  public static async loadCreated(): Promise<void> {
    backend.get('exercise/mine').then(res => this.setCreated(res.data));
  }

  public static setCreated(exercises: IExercise[]): void {
    store.commit('createdExercises', exercises);
  }

  public static getCreated(): IExercise[] | null {
    return store.getters.createdExercises;
  }

  public static addCreated(exercise: IExercise): void {
    let exercises = this.getCreated() || [];
    let exists = false;
    exercises = exercises.map(x => {
      if (x._id === exercise._id) {
        exists = true;
        return exercise;
      }
      return x;
    });
    if (!exists) exercises.push(exercise);
    this.setCreated(exercises);
  }

  public static removeCreated(id: string): void {
    const exercises = this.getCreated() || [];
    this.setCreated(exercises.filter(x => x._id !== id));
  }

  public static getAccepted(): IExercise[] | null {
    const exercises = this.getCreated();
    if (!exercises) return null;
    return exercises.filter(x => x.reviewed);
  }

  public static getSubmitted(): IExercise[] | null {
    const exercises = this.getCreated();
    if (!exercises) return null;
    return exercises.filter(x => !x.reviewed || !!x.editedData);
  }

  public static isAuthor(id: string): boolean {
    return (ExerciseManagement.getCreated() || [])
      .filter(x => x._id === id)
      .some(x => x.author === UserManagement.getUserID());
  }

  public static canSubmitChange(id: string): boolean {
    return (ExerciseManagement.getAccepted() || [])
      .filter(x => x._id === id)
      .some(x => x.author === UserManagement.getUserID());
  }

  public static async loadSubmissions(): Promise<boolean> {
    const user = UserManagement.getUser();
    if (user && ['Admin', 'Moderator'].includes(user.group)) {
      if (this.getSubmissions()) return true;

      const { data } = await backend.get('exercise/submissions');
      this.setSubmissions(data);
      return true;
    }
    return false;
  }

  public static setSubmissions(exercise: IExercise[]): void {
    store.commit('submittedExercises', exercise);
  }

  public static getSubmissions(): IExercise[] | null {
    return store.getters.submittedExercises;
  }

  public static addSubmission(exercise: IExercise): void {
    let exercises = this.getSubmissions() || [];
    let exists = false;
    exercises = exercises.map(x => {
      if (x._id === exercise._id) {
        exists = true;
        return exercise;
      }
      return x;
    });
    if (!exists) exercises.push(exercise);
    this.setSubmissions(exercises);
  }

  public static removeSubmission(id: string): void {
    const exercises = this.getSubmissions() || [];
    this.setSubmissions(exercises.filter(x => x._id !== id));
  }
}
