import { FormValidator } from 'src/FormValidator';
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { INutrition } from './interfaces/INutrition';
import { IRecipeIngredient } from './interfaces/IRecipeIngredient';

export class RecipeFormValidator extends FormValidator {
  // prettier-ignore
  public static checkIngredients(ing: IRecipeIngredient[]): IRecipeIngredient[] {

    if (!ing || ing.length === 0) {
      this.throwEx('Bitte gib eine Zutatenliste an');
    }

    return ing.map((x, i) => {
      return {
        // prettier-ignore
        name: this.checkString(x.name, 'Der Name der Zutat #' + (i + 1) + 'fehlt'),
        // prettier-ignore
        amount: this.checkString(x.amount, 'Die Menge die an ' + x.name + ' benötigt wird fehlt'),
        // prettier-ignore
        unit: this.checkString(x.unit, 'Die Einheit der Menge der Zutat ' + x.name + ' fehlt'),
      };
    });
  }

  public static checkNutrition(nut: INutrition[]): INutrition[] {
    if (!nut || nut.length === 0) {
      this.throwEx('Bitte gib eine Nährtwertliste an');
    }
    return nut.map((x, i) => {
      return {
        // prettier-ignore
        title: this.checkString(x.title, 'Der Name des Nährwerts #' + (i + 1) + 'fehlt'),
        amount: this.checkNumberMinMax(
          // prettier-ignore
          this.checkNumber(x.amount, 'Die Menge des Nährwerts ' + x.title + ' fehlt'),
          -1 / 100000000000,
          Number.MAX_VALUE,
          // prettier-ignore
          'Die Nährwertsmenge von ' + x.title + ' kann nicht kleiner als 0 sein',
        ),
        // prettier-ignore
        unit: this.checkString(x.unit, 'Die Einheit des Nährwerts ' + x.title + ' fehlt'),
      };
    });
  }

  // prettier-ignore
  public static validate(dto: CreateRecipeDTO, categories: string[]): CreateRecipeDTO {
    let { category, steps, ingredients, nutrition } = dto;
    const { difficulty, thumbnail, time, title } = dto;

    this.checkString(title, 'Bitte gib einen Titel an');
    this.checkString(thumbnail, 'Bitte gib ein Vorschaubild an');

    category = this.checkStringArray(category, 'Bitte gib eine Kategorie an');

    this.checkNumber(difficulty, 'Bitte gib eine Schwierigkeit an');

    // prettier-ignore
    this.checkNumberMinMax(difficulty, 1, 3, 'Die Schwierigkeit muss zwischen 1 und 3 liegen');

    // prettier-ignore
    steps = this.checkStringArray(steps, 'Bitte gib die Zubereitungsschritte an');

    // prettier-ignore
    this.checkNumber(time, 'Bitte gib eine durchschnittliche Zubereitungszeit an');

    // prettier-ignore
    this.checkNumberMinMax(time, 1, Number.MAX_VALUE, 'Die Zubereitungszeit kann nicht unter einer Sekunde liegen');

    ingredients = this.checkIngredients(dto.ingredients);
    nutrition = this.checkNutrition(dto.nutrition);

    category = this.compareStringArry(category, categories, ' ist keine verfügbare Kategorie');

    return {
      ...dto,
      ingredients: ingredients,
      nutrition: nutrition,
      steps: steps,
      category: category,
    };
  }
}
