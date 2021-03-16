import store from '@/store';
import backend from './backend';
import { INutritionplan } from './interfaces';

export class NutritionplanManagement {
  private static commit(plans: INutritionplan[]): void {
    if (!plans) return;
    store.commit('nutritionplans', plans);
  }

  public static async loadPlans(): Promise<void> {
    if (this.plans) return;
    const { data } = await backend.get('nutritionplan');
    this.commit(data);
  }

  public static get plans(): INutritionplan[] | null {
    return store.getters.nutritionplans;
  }

  public static addPlan(plan: INutritionplan): void {
    let plans = this.plans;
    if (!plans) return;
    let exists = false;
    plans = plans.map(x => {
      if (x._id === plan._id) {
        exists = true;
        return plan;
      }
      return x;
    });
    if (!exists) plans.push(plan);
    this.commit(plans);
  }

  public static removePlan(id: string): void {
    let plans = this.plans;
    if (!plans) return;
    plans = plans.filter(x => x._id !== id);
    this.commit(plans);
  }
}
