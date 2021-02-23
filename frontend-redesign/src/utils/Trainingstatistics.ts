import store from '@/store';
import backend from './backend';
import { IHealth } from './interfaces';

export class TrainingStatistics {
  public static async loadCharts(): Promise<void> {
    const { data } = await backend.get('charts');
    store.commit('trainingStats', data);
  }

  public static async loadWeights(): Promise<void> {
    const { data } = await backend.get('health/weight');
    store.commit('weight', data);
  }

  public static async loadHeights(): Promise<void> {
    const { data } = await backend.get('health/height');
    store.commit('height', data);
  }

  public static async loadWater(): Promise<void> {
    const { data } = await backend.get('health/water');
    store.commit('water', data);
  }

  public static getChartData(): number[][] {
    return store.getters.trainingStats || Array.from({ length: 28 }, () => []);
  }

  public static getWeight(): IHealth[] | null {
    return store.getters.weight;
  }

  public static getWater(): IHealth[] | null {
    return store.getters.water;
  }

  public static getHeight(): number | null {
    const height: IHealth | null = store.getters.height;
    if (!height) return null;
    return height.value;
  }

  public static async setHeight(height: number): Promise<void> {
    const { data } = await backend.post('health/height', { amount: height });
    store.commit('height', data);
  }

  public static async addWeight(weight: number): Promise<void> {
    const { data } = await backend.post('health/weight', { amount: weight });
    const weights = this.getWeight() || [];
    weights.push(data);
    store.commit('weight', weights);
  }

  public static async addWater(amount: number): Promise<void> {
    const { data } = await backend.post('health/water', { amount: amount });
    let water = this.getWater() || [];
    let exists = false;
    water = water.map(x => {
      if (x._id === data._id) {
        exists = true;
        return data;
      }
      return x;
    });
    if (!exists) {
      water.push(data);
    }
    store.commit('water', water);
  }
}
