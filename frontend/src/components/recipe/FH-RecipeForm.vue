<template>
  <div class="fh-recipe-form">
    <h1>Allgemein</h1>

    <tl-grid gap="0 30">
      <tc-input
        title="Name des Rezepts"
        v-model="recipe.title"
        :dark="$store.getters.darkmode"
        icon="book-cook"
      />
      <tc-input
        icon="image"
        title="Thumbnail"
        v-model="recipe.thumbnail"
        :dark="$store.getters.darkmode"
      />
      <tc-input
        icon="link"
        title="Video (optional)"
        v-model="recipe.video"
        :dark="$store.getters.darkmode"
      />
      <div>
        <div class="title">Kategorie</div>
        <tc-select
          tfbackground="success"
          @selectedItems="c => (recipe.category = c)"
          :multiple="true"
          placeholder="Wähle mind. eine Kategorie"
          :dark="$store.getters.darkmode"
        >
          <tc-select-item
            v-for="c in categories"
            :defaultSelected="recipe.category.includes(c)"
            :key="c"
            :title="c"
          />
        </tc-select>
      </div>
      <tc-input
        title="Zeit (min)"
        v-model="recipe.time"
        icon="clock-simple"
        type="number"
        :dark="$store.getters.darkmode"
      />
    </tl-grid>

    <h1>Informationen</h1>

    <tl-grid>
      <div>
        <h2>Zutaten</h2>
        <tl-grid minWidth="50" gap="10">
          <tc-input
            v-model="ingredientInput.name"
            :dark="$store.getters.darkmode"
            title="Name"
          />
          <tc-input
            v-model="ingredientInput.amount"
            :dark="$store.getters.darkmode"
            title="Menge"
          />
          <tc-input
            v-model="ingredientInput.unit"
            :dark="$store.getters.darkmode"
            title="Einheit"
          />
        </tl-grid>
        <tc-button
          :disabled="$store.getters.loading"
          name="Hinzufügen"
          tfbackground="success"
          @click="addIngredient"
        />
        <template v-if="recipe.ingredients.length > 0">
          <div class="title">Zutaten</div>
          <tc-table :dark="$store.getters.darkmode">
            <tc-tr v-for="(i, index) in recipe.ingredients" :key="i.name">
              <tc-td>{{ i.name }}</tc-td>
              <tc-td>{{ i.amount + i.unit }}</tc-td>
              <tc-td>
                <tc-link tfcolor="error" @click="removeIngredient(index)">
                  entfernen
                </tc-link>
              </tc-td>
            </tc-tr>
          </tc-table>
        </template>
      </div>
      <div>
        <h2>Nährwerte</h2>
        <tl-grid minWidth="50" gap="10">
          <tc-input
            v-model="nutritionInput.title"
            :dark="$store.getters.darkmode"
            title="Name"
          />
          <tc-input
            v-model="nutritionInput.amount"
            type="number"
            :buttons="true"
            :dark="$store.getters.darkmode"
            title="Menge"
            :step="0.1"
            @input="roundNutrition"
          />
          <tc-input
            v-model="nutritionInput.unit"
            :dark="$store.getters.darkmode"
            title="Einheit"
          />
        </tl-grid>
        <tc-button
          :disabled="$store.getters.loading"
          name="Hinzufügen"
          tfbackground="success"
          @click="addNutrition"
        />
        <template v-if="recipe.nutrition.length > 0">
          <div class="title">Nährwerte</div>
          <tc-table :dark="$store.getters.darkmode">
            <tc-tr v-for="(n, index) in recipe.nutrition" :key="n.title">
              <tc-td>{{ n.title }}</tc-td>
              <tc-td>{{ n.amount + n.unit }}</tc-td>
              <tc-td>
                <tc-link tfcolor="error" @click="removeNutrition(index)">
                  entfernen
                </tc-link>
              </tc-td>
            </tc-tr>
          </tc-table>
        </template>
      </div>
      <div>
        <h2>Schritte</h2>
        <tc-textarea
          v-model="stepInput"
          :rows="5"
          :dark="$store.getters.darkmode"
          title="Schritt"
        />
        <tc-button
          :disabled="$store.getters.loading"
          name="Hinzufügen"
          tfbackground="success"
          @click="addStep"
        />
        <template v-if="recipe.steps.length > 0">
          <div class="title">Schritte</div>
          <tc-table :dark="$store.getters.darkmode">
            <tc-tr v-for="(s, index) in recipe.steps" :key="s">
              <tc-td>{{ index + 1 }}</tc-td>
              <tc-td>{{ s }}</tc-td>
              <tc-td>
                <tc-link tfcolor="error" @click="removeStep(index)">
                  entfernen
                </tc-link>
              </tc-td>
            </tc-tr>
          </tc-table>
        </template>
      </div>
    </tl-grid>

    <h1>Sonstiges</h1>

    <tl-grid>
      <div>
        <tl-flow horizontal="space-between">
          <h2>Schwierigkeit</h2>
          <div class="indicator" :diff="recipe.difficulty">
            <i
              class="ti-gastro-assistant"
              v-for="(i, j) in Array(+recipe.difficulty)"
              :key="j"
            />
          </div>
        </tl-flow>
        <tc-slider
          v-model="recipe.difficulty"
          min="1"
          max="3"
          step="1"
          :dark="$store.getters.darkmode"
          iconStart="apple-alt"
          iconEnd="gastro-assistant"
          tfcolor="success"
        />
      </div>
      <div>
        <h2>Bemerkungen</h2>
        <tc-textarea
          v-model="recipe.description"
          :dark="$store.getters.darkmode"
          title="Tipps & Variationen"
        />
      </div>
      <div>
        <h2>Quelle</h2>
        <p>{{ recipe.source }}</p>
        <tc-input
          :dark="$store.getters.darkmode"
          icon="link"
          v-model="recipe.source"
          placeholder="https://..."
          title="Link zur Quelle"
        />
      </div>
    </tl-grid>

    <div class="buttons">
      <tc-button
        :disabled="$store.getters.loading"
        v-if="mode !== 'edit'"
        variant="filled"
        tfbackground="success"
        name="Veröffentlichen"
        icon="globe"
        @click="createRecipe"
      />
      <template v-else>
        <tc-button
          :disabled="$store.getters.loading"
          variant="filled"
          tfbackground="success"
          name="Änderungen speichern"
          icon="pencil"
          @click="updateRecipe"
        />
        <tc-button
          :disabled="$store.getters.loading"
          variant="filled"
          tfbackground="error"
          name="Rezept löschen"
          icon="trashcan-alt"
          @click="deleteRecipe"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { INutrition, IRecipe, IRecipeIngredient } from '@/utils/interfaces';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CreateRecipeDTO } from '@/utils/dtos';
import axios from '@/utils/axios';
import { defaultRecipe, validate } from '@/utils/recipeFormValidator';
import { getCategoryNames } from '@/utils/functions';

@Component
export default class FHRecipeForm extends Vue {
  @Prop({ default: 'new' }) mode!: 'new' | 'edit';
  @Prop() recipeInput!: IRecipe;

  public recipe: CreateRecipeDTO = this.recipeInput || defaultRecipe;
  public ingredientInput: IRecipeIngredient = {
    name: '',
    amount: '',
    unit: ''
  };
  public nutritionInput: INutrition = {
    title: '',
    amount: 0,
    unit: ''
  };
  public stepInput = '';

  @Watch('recipeInput')
  recipeInputChanged() {
    if (this.recipeInput) {
      this.recipe = this.recipeInput;
    }
  }

  get categories(): string[] {
    return getCategoryNames();
  }

  public roundNutrition(): void {
    const split = (this.nutritionInput.amount + '').split('.');
    let rounded = 0;
    if (split.length > 1) {
      rounded = +(split[0] + '.' + (split[1] + '00').substring(0, 2));
    } else {
      rounded = +split[0];
    }
    this.nutritionInput = {
      ...this.nutritionInput,
      amount: rounded
    };
  }

  public addIngredient() {
    if (
      this.ingredientInput.name.length === 0 ||
      this.ingredientInput.amount.length === 0 ||
      this.ingredientInput.unit.length === 0
    ) {
      return;
    }
    this.recipe.ingredients.push(this.ingredientInput);
    this.ingredientInput = { name: '', amount: '', unit: '' };
  }

  public addNutrition() {
    if (
      this.nutritionInput.title.length === 0 ||
      this.nutritionInput.amount <= 0 ||
      this.nutritionInput.unit.length === 0
    ) {
      return;
    }
    this.recipe.nutrition.push(this.nutritionInput);
    this.nutritionInput = { title: '', amount: 0, unit: '' };
  }

  public addStep() {
    if (this.stepInput.length < 5) return;
    this.recipe.steps.push(this.stepInput);
    this.stepInput = '';
  }

  public removeIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }

  public removeNutrition(index: number) {
    this.recipe.nutrition.splice(index, 1);
  }

  public removeStep(index: number) {
    this.recipe.steps.splice(index, 1);
  }

  public validateInput(): CreateRecipeDTO | null {
    return validate(this.recipe);
  }

  // Auf den Anwender selbst bezogen
  public async createRecipe(): Promise<void> {
    const created = this.validateInput();
    if (created) {
      axios.post('recipe', created).then(res => {
        this.$store.commit('addRecipe', res.data);
        this.$router.push({ name: 'recipes' });
      });
    }
  }

  public async updateRecipe(): Promise<void> {
    const created = this.validateInput();
    if (this.recipeInput && created) {
      axios.put('recipe/update/' + this.recipeInput._id, created).then(res => {
        this.$store.commit('addRecipe', res.data);
        this.$router.push({ name: 'recipes' });
      });
    }
  }

  public async deleteRecipe(): Promise<void> {
    if (this.recipeInput) {
      axios.delete('recipe/' + this.recipeInput._id).then(() => {
        this.$store.commit('removeRecipe', this.recipeInput._id);
        this.$store.commit('removeFavedRecipe', this.recipeInput._id);
        this.$router.push({ name: 'recipes' });
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-weight: 700;
  white-space: nowrap;
  margin: 10px 0 2px;
  margin-left: 8px;
}

/deep/ textarea {
  min-height: 50px !important;
}
.indicator {
  &[diff='1'] {
    color: $success;
  }
  &[diff='2'] {
    color: $alarm;
  }
  &[diff='3'] {
    color: $error;
  }
  i {
    margin-left: 5px;
  }
}
h2 {
  margin-top: 0;
}
.buttons {
  margin-top: 20px;
  display: grid;
  grid-gap: 10px;
  @media #{$isDesktop} {
    margin-bottom: 20px;
  }
}
</style>
