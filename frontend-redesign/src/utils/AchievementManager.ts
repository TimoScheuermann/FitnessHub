import store from '@/store';
import backend from './backend';
import { IAchievment } from './interfaces';

export class AchievementManager {
  public static add(achievement: IAchievment): void {
    let ach = this.getAll() || [];

    let exsits = false;
    ach = ach.map(x => {
      if (x.exerciseId === achievement.exerciseId) {
        exsits = true;
        return x;
      }
      return x;
    });

    if (!exsits) {
      ach.push(achievement);
      store.commit('newAchievements');
    }
    store.commit('achievements', ach);
  }

  public static async load(): Promise<void> {
    const { data } = await backend.get('achievement');
    store.commit('achievements', data);
  }

  public static getAll(): IAchievment[] | null {
    return store.getters.achievements;
  }

  public static getNew(): number {
    return store.getters.newAchievements;
  }
}
