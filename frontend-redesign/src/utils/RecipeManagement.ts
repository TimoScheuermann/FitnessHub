import store from '@/store';
import backend from './backend';
import { IRecipe } from './interfaces';

export class RecipeManagement {
  public static async loadLiked(): Promise<void> {
    const { data } = await backend.get('recipe/liked');
    store.commit('likedRecipes', data);
  }

  public static async loadCreated(): Promise<void> {
    const { data } = await backend.get('recipe/mine');
    store.commit('createdRecipes', data);
  }

  public static addCreated(recipe: IRecipe): void {
    let recipes = this.getCreated() || [];
    let exists = false;
    recipes = recipes.map(r => {
      if (r._id === recipe._id) {
        exists = true;
        return recipe;
      }
      return r;
    });
    if (!exists) recipes.push(recipe);
    store.commit('createdRecipes', recipes);
  }

  public static removeCreate(id: string): void {
    let recipes = this.getCreated() || [];
    recipes = recipes.filter(x => x._id !== id);
    store.commit('createdRecipes', recipes);
  }

  public static getCreated(): IRecipe[] | null {
    return store.getters.createdRecipes;
  }

  public static getLikedRecipes(): IRecipe[] | null {
    return store.getters.likedRecipes;
  }

  public static hasLiked(id: string): boolean {
    const liked = this.getLikedRecipes();
    if (!liked) return false;
    return liked.some(x => x._id === id);
  }

  public static toggleLike(recipe: IRecipe) {
    let recipes = this.getLikedRecipes();
    if (!recipes) return;

    const liked = this.hasLiked(recipe._id);

    if (liked) {
      recipes = recipes.filter(x => x._id !== recipe._id);
      store.commit('likedRecipes', recipes);
      backend.delete('recipe/like/' + recipe._id);
    } else {
      recipes.push(recipe);
      store.commit('likedRecipes', recipes);
      backend.put('recipe/like/' + recipe._id);
    }
  }
}
