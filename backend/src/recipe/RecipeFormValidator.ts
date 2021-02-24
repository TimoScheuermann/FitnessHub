import { FormValidator } from 'src/FormValidator';
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { INutrition } from './interfaces/INutrition';
import { IRecipeIngredient } from './interfaces/IRecipeIngredient';

export class RecipeFormValidator extends FormValidator {
  public static checkIngredients(
    ing: IRecipeIngredient[],
  ): IRecipeIngredient[] {
    if (!ing || ing.length === 0) {
      this.throwEx('Bitte gib eine Zutatenliste an');
    }
    return ing.map((x, i) => {
      return {
        name: this.checkString(
          x.name,
          'Der Name der Zutat #' + (i + 1) + 'fehlt',
        ),
        amount: this.checkString(
          x.amount,
          'Die Mange die an ' + x.name + ' benötigt wird fehlt',
        ),
        unit: this.checkString(
          x.unit,
          'Die Einheit der Menge der Zutat ' + x.name + ' fehlt',
        ),
      };
    });
  }

  public static checkNutrition(nut: INutrition[]): INutrition[] {
    if (!nut || nut.length === 0) {
      this.throwEx('Bitte gib eine Nährtwertliste an');
    }
    return nut.map((x, i) => {
      return {
        title: this.checkString(
          x.title,
          'Der Name des Nährwerts #' + (i + 1) + 'fehlt',
        ),

        amount: this.checkNumberMinMax(
          this.checkNumber(
            x.amount,
            'Die Mange des Nährwerts ' + x.title + ' fehlt',
          ),
          0,
          Number.MAX_VALUE,
          'Die Nährwertsmenge von ' +
            x.title +
            ' kann nicht kleiner als 0 sein',
        ),
        unit: this.checkString(
          x.unit,
          'Die Einheit des Nährwerts ' + x.title + ' fehlt',
        ),
      };
    });
  }

  public static validate(
    dto: CreateRecipeDTO,
    categories: string[],
  ): CreateRecipeDTO {
    let { category, steps, ingredients, nutrition } = dto;
    const { difficulty, thumbnail, time, title } = dto;

    FormValidator.checkString(title, 'Bitte gib einen Titel an');
    FormValidator.checkString(thumbnail, 'Bitte gib ein Vorschaubild an');

    category = FormValidator.checkStringArray(
      category,
      'Bitte gib eine Kategorie an',
    );

    FormValidator.checkNumber(difficulty, 'Bitte gib eine Schwierigkeit an');
    FormValidator.checkNumberMinMax(
      difficulty,
      1,
      3,
      'Die Schwierigkeit muss zwischen 1 und 3 liegen',
    );

    steps = FormValidator.checkStringArray(
      steps,
      'Bitte gib die Zubereitungsschritte an',
    );

    FormValidator.checkNumber(
      time,
      'Bitte gib eine durchschnittliche Zubereitungszeit an',
    );
    FormValidator.checkNumberMinMax(
      time,
      1,
      Number.MAX_VALUE,
      'Die Zubereitungszeit kann nicht unter einer Sekunde liegen',
    );

    ingredients = this.checkIngredients(dto.ingredients);
    nutrition = this.checkNutrition(dto.nutrition);

    category = FormValidator.compareStringArry(
      category,
      categories,
      ' ist keine verfügbare Kategorie',
    );

    return {
      ...dto,
      ingredients: ingredients,
      nutrition: nutrition,
      steps: steps,
      category: category,
    };
  }
}
