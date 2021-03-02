import store from '@/store';
import backend from './backend';
import { IVariable } from './interfaces';

export class VariableManagement {
  public static async loadVariables(): Promise<void> {
    const { data } = await backend.get('variables');
    this.setVariables(data);
  }

  public static setVariables(vars: IVariable[] | null): void {
    if (vars) store.commit('variables', vars);
  }

  public static getVariables(): IVariable[] | null {
    const vars: IVariable[] | null = store.getters.variables;
    if (!vars) return null;
    return vars.sort((a, b) => a.title.localeCompare(b.title));
  }

  public static getMuscles(): IVariable[] | null {
    const vars = this.getVariables();
    if (!vars) return null;
    return vars.filter(x => x.type === 'muscle');
  }

  public static getMuscleNames(): string[] | null {
    const muscles = this.getMuscles();
    if (!muscles) return null;
    return muscles.map(x => x.title);
  }

  public static getCategories(): IVariable[] | null {
    const vars = this.getVariables();
    if (!vars) return null;
    return vars.filter(x => x.type === 'category');
  }

  public static getCategoryNames(): string[] | null {
    const categories = this.getCategories();
    if (!categories) return null;
    return categories.map(x => x.title);
  }

  public static addVariable(va: IVariable): void {
    let vars = this.getVariables() || [];
    let exsits = false;
    vars = vars.map(x => {
      if (x._id === va._id) {
        exsits = true;
        return va;
      }
      return x;
    });
    if (!exsits) vars.push(va);
    this.setVariables(vars);
  }

  public static removeVariable(id: string): void {
    const vars = this.getVariables() || [];
    this.setVariables(vars.filter(x => x._id !== id));
  }
}
