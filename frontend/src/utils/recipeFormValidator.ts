import { CreateRecipeDTO } from './dtos';
import { sendNotification } from './functions';

function notifiy(missing: string, info: string) {
  sendNotification({
    title: 'Fehlende Angabe: ' + missing,
    text: info
  });
}

export function validate(recipe: CreateRecipeDTO): CreateRecipeDTO | null {
  if (recipe.title.length === 0) {
    notifiy('Name', 'Bitte trage einen Namen für das Rezept ein');
    return null;
  }
  if (recipe.time < 0) {
    notifiy('Zeit', 'Bitte füge eine Zubereitungszeit hinzu');
    return null;
  }
  if (recipe.ingredients.length === 0) {
    notifiy('Zutaten', 'Bitte füge mindestens eine Zutat hinzu');
    return null;
  }
  if (recipe.nutrition.length === 0) {
    notifiy('Nährwerte', 'Bitte füge Nährwertinformationen zum Rezept hinzu');
    return null;
  }
  if (recipe.category.length === 0) {
    notifiy('Kategorie', 'Bitte wähle mindestens eine Kategorie');
    return null;
  }
  if (recipe.thumbnail.length === 0) {
    notifiy(
      'Thumbnail',
      'Bitte füge einen Link zu einem Bild des Gerichts hinzu'
    );
    return null;
  }
  if (recipe.steps.length === 0) {
    notifiy('Schritt', 'Bitte füge mindestens einen Zubereitungsschritt hinzu');
    return null;
  }

  const createObject: CreateRecipeDTO = {
    ...recipe,
    time: recipe.time * 60
  };
  return createObject;
}

export const defaultRecipe: CreateRecipeDTO = {
  title: '',
  thumbnail: '',
  time: 15,
  ingredients: [],
  nutrition: [],
  category: [],
  difficulty: 1,
  steps: []
};
