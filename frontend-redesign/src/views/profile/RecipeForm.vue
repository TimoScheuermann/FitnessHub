<template>
  <div class="view-recipe-form" content>
    <FHErrorList id="create-recipe" />
    <div max-width>
      <h3>Rezept erstellen</h3>

      <tc-segments :dark="$store.getters.darkmode" v-model="segment">
        <tc-segment-item title="Infos" />
        <tc-segment-item title="Angaben" />
        <tc-segment-item title="Optional" />
      </tc-segments>

      <div class="spacer" />

      <FHAppear>
        <div v-if="segment == 0">
          <tc-input
            title="Name des Rezepts"
            v-model="dto.title"
            :dark="$store.getters.darkmode"
          />
          <tc-input
            title="Vorschaubild"
            v-model="dto.thumbnail"
            :dark="$store.getters.darkmode"
          />
          <div class="title">Kategorie(n)</div>
          <tc-select
            :dark="$store.getters.darkmode"
            tfbackground="success"
            @selectedItems="c => (dto.category = c)"
            :multiple="true"
            placeholder="Wähle eine oder mehrere Kategorien"
          >
            <tc-select-item
              v-for="c in categories"
              :key="c"
              :defaultSelected="dto.category.includes(c)"
              :title="c"
            />
          </tc-select>

          <tc-input
            title="Benötigte Zeit (min)"
            v-model="dto.time"
            type="number"
            :step="5"
            :dark="$store.getters.darkmode"
          />
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="segment == 1">
          <div class="title">Zutaten</div>
          <tc-table :dark="$store.getters.darkmode">
            <tc-tr v-for="(z, i) in dto.ingredients" :key="'z-' + i">
              <tc-td>{{ z.name }}</tc-td>
              <tc-td>{{ z.amount }} {{ z.unit }}</tc-td>
              <tc-td>
                <tc-link tfcolor="error" @click="removeIngredient(i)">
                  entfernen
                </tc-link>
              </tc-td>
            </tc-tr>
          </tc-table>
          <div class="fh-graph-card">
            <div class="title" small>Neue Zutat</div>
            <tc-input
              placeholder="Name"
              v-model="ingredient.name"
              :dark="$store.getters.darkmode"
            />
            <tl-grid gap="0" minWidth="100">
              <tc-input
                placeholder="Menge"
                v-model="ingredient.amount"
                :dark="$store.getters.darkmode"
              />
              <tc-input
                placeholder="Einheit"
                v-model="ingredient.unit"
                :dark="$store.getters.darkmode"
              />
            </tl-grid>
            <tl-flow>
              <tc-link tfcolor="success" @click="addIngredient">
                Zutat hinzufügen
              </tc-link>
            </tl-flow>
          </div>

          <div class="title">Nährwertangabe</div>
          <tc-table :dark="$store.getters.darkmode">
            <tc-tr v-for="(n, i) in dto.nutrition" :key="'n-' + i">
              <tc-td>{{ n.title }}</tc-td>
              <tc-td>{{ n.amount }} {{ n.unit }}</tc-td>
              <tc-td>
                <tc-link tfcolor="error" @click="removeNutrition(i)">
                  entfernen
                </tc-link>
              </tc-td>
            </tc-tr>
          </tc-table>
          <div class="fh-graph-card">
            <div class="title" small>Weitere Angabe</div>
            <tc-input
              placeholder="Name"
              v-model="nutrition.title"
              :dark="$store.getters.darkmode"
            />
            <tl-grid gap="0" minWidth="100">
              <tc-input
                placeholder="Menge"
                v-model="nutrition.amount"
                type="number"
                :min="0"
                :step="0.1"
                :dark="$store.getters.darkmode"
              />
              <tc-input
                placeholder="Einheit"
                v-model="nutrition.unit"
                :dark="$store.getters.darkmode"
              />
            </tl-grid>
            <tl-flow>
              <tc-link tfcolor="success" @click="addNutrition">
                Angabe hinzufügen
              </tc-link>
            </tl-flow>
          </div>

          <div class="title">Zubereitungsschritte</div>
          <tc-table :dark="$store.getters.darkmode">
            <tc-tr v-for="(s, i) in dto.steps" :key="'s-' + i">
              <tc-td>{{ s }}</tc-td>
              <tc-td>
                <tc-link tfcolor="error" @click="removeNutrition(i)">
                  entfernen
                </tc-link>
              </tc-td>
            </tc-tr>
          </tc-table>
          <div class="fh-graph-card">
            <div class="title" small>Weiterer Schritt</div>
            <tc-textarea v-model="step" :dark="$store.getters.darkmode" />
            <tl-flow>
              <tc-link tfcolor="success" @click="addStep">
                Schritt hinzufügen
              </tc-link>
            </tl-flow>
          </div>

          <div class="title" sub>Schwierigkeit</div>
          <tc-slider
            min="1"
            max="3"
            tfcolor="success"
            iconStart="apple-alt"
            iconEnd="gastro-assistant"
            v-model="dto.difficulty"
          />
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="segment == 2">
          <tc-input
            title="Videoanleitung"
            v-model="dto.video"
            :dark="$store.getters.darkmode"
          />
          <tc-input
            title="Original"
            v-model="dto.source"
            :dark="$store.getters.darkmode"
          />
          <tc-textarea
            title="Tipps & Variationen"
            v-model="dto.description"
            :dark="$store.getters.darkmode"
          />
        </div>
      </FHAppear>

      <br />
      <tl-flow>
        <tc-button
          name="Rezept veröffentlichen"
          tfbackground="success"
          :disabled="isSubmitting"
          @click="submit"
        />
      </tl-flow>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHErrorList from '@/components/FHErrorList.vue';
import backend from '@/utils/backend';
import { CreateRecipeDTO } from '@/utils/dtos';
import { FHEventBus } from '@/utils/FHEventbus';
import { INutrition, IRecipeIngredient, IVariable } from '@/utils/interfaces';
import { NotificationManagement } from '@/utils/NotificationManagement';
import { RecipeManagement } from '@/utils/RecipeManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear,
    FHErrorList
  }
})
export default class RecipeForm extends Vue {
  public segment = 1;
  public isSubmitting = false;
  public ingredient: IRecipeIngredient = { name: '', amount: '', unit: '' };
  public nutrition: INutrition = { title: '', amount: 0, unit: '' };
  public step = '';
  public dto: CreateRecipeDTO = {
    title: '',
    thumbnail: '',
    category: [],
    time: 15,
    difficulty: 1,
    ingredients: [],
    nutrition: [],
    steps: []
  };

  beforeMount() {
    if (!this.categories) {
      this.$router.push({ name: 'recipes' });
      NotificationManagement.sendNotification(
        'Aktion zurzeit nicht möglich',
        'Bitte versuche es zu einem späteren Zeitpunkt'
      );
    }
  }

  get categories(): string[] | null {
    const vars: IVariable[] | null = this.$store.getters.variables;
    if (!vars) return null;
    return vars
      .filter(x => x.type === 'category')
      .map(x => x.title)
      .sort((a, b) => a.localeCompare(b));
  }

  public addIngredient(): void {
    const { name, amount, unit } = this.ingredient;
    if (name.length === 0) return;
    if (amount.length === 0) return;
    if (unit.length === 0) return;
    this.dto.ingredients.push(this.ingredient);
    this.ingredient = { name: '', amount: '', unit: '' };
  }

  public removeIngredient(index: number): void {
    this.dto.ingredients.splice(index, 1);
  }

  public addNutrition(): void {
    const { title, amount, unit } = this.nutrition;
    if (title.length === 0) return;
    if (amount < 0) return;
    if (unit.length === 0) return;
    this.dto.nutrition.push({ ...this.nutrition, amount: +amount });
    this.nutrition = { title: '', amount: 0, unit: '' };
  }

  public removeNutrition(index: number): void {
    this.dto.nutrition.splice(index, 1);
  }

  public addStep(): void {
    if (this.step.length < 10) return;
    this.dto.steps.push(this.step);
    this.step = '';
  }

  public removeStep(index: number): void {
    this.dto.steps.splice(index, 1);
  }

  public async submit(): Promise<void> {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    backend
      .post('recipe', this.dto)
      .then(res => {
        RecipeManagement.addCreated(res.data);
        this.$router.push({ name: 'recipes' });
      })
      .catch(err => {
        const { statusCode, message } = err;
        if (statusCode === 422 && message) {
          FHEventBus.$emit('fh-error-list-create-recipe', message);
        }
        this.isSubmitting = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.view-recipe-form {
  padding-top: 0;

  .title {
    font-weight: 700;
    white-space: nowrap;
    margin: 10px 0 2px;
    margin-left: 8px;
    &[sub] {
      margin-bottom: 15px;
    }
    &[small] {
      text-align: center;
      font-size: 14px;
      margin: 0px;
      margin-bottom: 10px;
    }
  }
  .spacer {
    height: 5px;
  }

  .fh-graph-card {
    margin-top: 10px;
    .tl-flow {
      margin-top: 10px;
    }
  }

  .tc-table-2 {
    margin-top: 5px;
    /deep/ .tc-td {
      height: 30px;
    }
  }
}
</style>
