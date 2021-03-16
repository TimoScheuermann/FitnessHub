import { FormValidator } from 'src/FormValidator';
import { CreateNutritionplanDTO } from './dtos/CreateNutritionplan.dto';

export class NutritionplanFormValidator extends FormValidator {
  public static async validate(
    dto: CreateNutritionplanDTO,
    category: string[],
    recipes: string[],
  ): Promise<CreateNutritionplanDTO> {
    let { categories } = dto;
    const { title, description } = dto;

    this.checkString(title, 'Bitte gib einen Titel an');
    this.checkString(description, 'Bitte gib eine Beschreibung an');

    categories = this.compareStringArry(
      categories,
      category,
      ' ist keine verfügbare Kategorie',
    );

    // Noch prüfen, ob Rezepte eingetragen wurden!!!

    let days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    let daytime = ['breakfast', 'lunch', 'dinner'];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    days = days.map((d) => {
      daytime = daytime.map((dt) => {
        const id = dto[d][dt];
        this.checkString(id, `Bitte gib ein Rezept für ${d} (${dt}) an.`);
        if (!recipes.some((x) => x == id)) {
          this.throwEx(
            `Das angegebene Rezept für ${d} (${dt}) existiert nicht.`,
          );
        }
        return dt;
      });
      let snacks = dto[d].snacks;
      snacks = this.compareStringArry(
        snacks,
        recipes,
        ` für ${d} (Snacks) ist kein gültiges Rezept.`,
      );
      dto[d].snacks = snacks;
      return d;
    });

    return { ...dto, categories: categories };
  }
}

// ID bei den Tagen gehört zu Rezept? Existiert das Rezept?
// Alle Felder haben Inhalte?
