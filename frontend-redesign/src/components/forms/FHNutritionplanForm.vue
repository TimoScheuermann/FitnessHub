<template>
  <div class="fh-nutritionplan-form">
    <FHErrorList :id="errorList" />
    <template v-if="plan">
      <tc-input
        :dark="$store.getters.darkmode"
        title="Titel"
        v-model="plan.title"
      />
      <tc-textarea
        :dark="$store.getters.darkmode"
        title="Beschreibung"
        v-model="plan.description"
      />

      <div class="title">Kategorie(n)</div>
      <tc-select
        :dark="$store.getters.darkmode"
        tfbackground="success"
        @selectedItems="c => (plan.categories = c)"
        :multiple="true"
        placeholder="Wähle eine oder mehrere Kategorien"
      >
        <tc-select-item
          v-for="c in categories"
          :key="c"
          :defaultSelected="plan.categories.includes(c)"
          :title="c"
        />
      </tc-select>

      <br />
      <br />
      <tc-segments :dark="$store.getters.darkmode" v-model="day">
        <tc-segment-item
          v-for="d in daynames"
          :key="d"
          :title="d.slice(0, 2)"
        />
      </tc-segments>

      <FHAppear>
        <div :key="day">
          <h3>{{ daynames[day] }}</h3>

          <div class="day-time" v-for="dt in Object.keys(daytimes)" :key="dt">
            <tl-flow horizontal="space-between">
              <div class="day-time--title">{{ daytimes[dt] }}</div>
              <tc-link tfcolor="success" @click="updateRecipe(dt)">
                <span v-if="getRecipe(dt)">Rezept ändern</span>
                <span v-else>Rezept wählen</span>
              </tc-link>
            </tl-flow>
            <div class="day-time-recipe" v-if="getRecipe(dt)">
              <tc-avatar :src="getRecipe(dt).thumbnail" border="rounded" />
              <tl-flow horizontal="start">
                <div class="recipe-title">
                  {{ getRecipe(dt).title }}
                </div>
              </tl-flow>
            </div>
          </div>

          <div class="day-time">
            <tl-flow horizontal="space-between">
              <div class="day-time--title">Snacks</div>
              <tc-link tfcolor="success" @click="updateRecipe('snacks')">
                Rezept hinzufügen
              </tc-link>
            </tl-flow>
            <div
              class="day-time-recipe"
              v-for="(s, i) in snacks"
              :key="i + s._id"
            >
              <tc-avatar :src="s.thumbnail" border="rounded" />
              <tl-flow horizontal="space-between">
                <div class="recipe-title">
                  {{ s.title }}
                </div>
                <tc-button
                  @click="removeSnack(i)"
                  icon="minus"
                  tfbackground="error"
                />
              </tl-flow>
            </div>
          </div>
        </div>
      </FHAppear>

      <br />
      <tl-flow>
        <tc-button
          v-if="!plan._id"
          name="Plan erstellen"
          icon="reply"
          tfbackground="success"
          variant="filled"
          :disabled="submitting"
          @click="createPlan"
        />
        <template v-else>
          <tc-button
            tfbackground="error"
            variant="filled"
            icon="trashcan-alt"
            name="Plan löschen"
            :disabled="submitting"
            @click="deletePlan"
          />
          <tc-button
            tfbackground="alarm"
            variant="filled"
            icon="swap"
            name="Plan updaten"
            :disabled="submitting"
            @click="updatePlan"
          />
        </template>
      </tl-flow>
    </template>
  </div>
</template>

<script lang="ts">
import backend from '@/utils/backend';
import { CreateNutritionplanDTO, NutritionplanDay } from '@/utils/dtos';
import { FHEventBus } from '@/utils/FHEventbus';
import { openFullscreen } from '@/utils/functions';
import { INutritionplan, INutritionplanDay, IRecipe } from '@/utils/interfaces';
import { NutritionplanManagement } from '@/utils/NutritionplanManagement';
import { VariableManagement } from '@/utils/VariableManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHAppear from '../FHAppear.vue';
import FHErrorList from '../FHErrorList.vue';
import FHList from '../list/FHList.vue';
import FHListItem from '../list/FHListItem.vue';

type daytime = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

const emptyDay: INutritionplanDay = {
  breakfast: null,
  lunch: null,
  dinner: null,
  snacks: []
};

@Component({
  components: {
    FHAppear,
    FHList,
    FHListItem,
    FHErrorList
  }
})
export default class FHNutritionplanForm extends Vue {
  @Prop() existingPlan!: INutritionplan;

  public errorList = 'nutritionplan-form';
  public submitting = false;
  public plan: INutritionplan | null = null;
  public daynames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  public daytimes = {
    breakfast: 'Frühstück',
    lunch: 'Mittagessen',
    dinner: 'Abendessen'
  };
  public day = 0;

  mounted() {
    if (this.$route.query.day) {
      const day = this.$route.query.day as string;
      this.daynames.forEach((d, i) => {
        if (d.toLowerCase() === day.toLowerCase()) {
          this.day = i;
        }
      });
    }
    if (this.$store.getters.nutritionplanForm) {
      this.plan = this.$store.getters.nutritionplanForm;
    } else if (this.existingPlan) {
      this.plan = this.existingPlan;
      delete this.plan.author;
      delete this.plan.created;
      delete this.plan.updated;
    } else {
      this.plan = {
        title: '',
        description: '',
        categories: [],
        monday: { ...emptyDay },
        tuesday: { ...emptyDay },
        wednesday: { ...emptyDay },
        thursday: { ...emptyDay },
        friday: { ...emptyDay },
        saturday: { ...emptyDay },
        sunday: { ...emptyDay }
      };
    }
  }

  get categories(): string[] | null {
    return VariableManagement.getCategoryNames();
  }

  getRecipe(daytime: daytime): IRecipe | null {
    if (!this.plan) return null;
    const day = this.daynames[this.day].toLowerCase();
    for (const [key, value] of Object.entries(this.plan)) {
      if (key === day) {
        for (const [dt, r] of Object.entries(value)) {
          if (dt === daytime) {
            return r ? (Object.assign({}, r) as IRecipe) : null;
          }
        }
      }
    }
    return null;
  }

  get snacks(): IRecipe[] {
    if (!this.plan) return [];
    const day = this.daynames[this.day].toLowerCase();
    for (const [key, value] of Object.entries(this.plan)) {
      if (key === day) {
        for (const [dt, r] of Object.entries(value)) {
          if (dt === 'snacks') {
            return r as IRecipe[];
          }
        }
      }
    }
    return [];
  }

  public removeSnack(index: number) {
    if (!this.plan) return;

    const day = this.daynames[this.day].toLowerCase();
    // eslint-disable-next-line
    (this.plan as any)[day].snacks.splice(index, 1);
  }

  public updateRecipe(daytime: daytime): void {
    this.$store.commit('nutritionplanForm', this.plan);
    openFullscreen('np-recipe-search', {
      day: this.daynames[this.day].toLowerCase(),
      daytime
    });
  }

  private mapDay(day: INutritionplanDay): NutritionplanDay {
    const { breakfast, lunch, dinner, snacks } = day;
    const snackIds = snacks.map(x => x._id);
    return {
      breakfast: breakfast ? breakfast._id : undefined,
      lunch: lunch ? lunch._id : undefined,
      dinner: dinner ? dinner._id : undefined,
      snacks: snackIds.length > 0 ? snackIds : undefined
    };
  }

  private getDTO(): CreateNutritionplanDTO | null {
    if (!this.plan) return null;
    const { title, description, categories } = this.plan;
    const dto: CreateNutritionplanDTO = {
      title: title,
      description: description,
      categories: categories,
      monday: this.mapDay(this.plan.monday),
      tuesday: this.mapDay(this.plan.tuesday),
      wednesday: this.mapDay(this.plan.wednesday),
      thursday: this.mapDay(this.plan.thursday),
      friday: this.mapDay(this.plan.friday),
      saturday: this.mapDay(this.plan.saturday),
      sunday: this.mapDay(this.plan.sunday)
    };

    return dto;
  }

  public createPlan(): void {
    if (this.submitting) return;
    const dto = this.getDTO();
    if (!dto) return;
    this.submitting = true;

    backend
      .post('nutritionplan', dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  public updatePlan(): void {
    if (this.submitting) return;
    if (!this.plan) return;
    if (!this.plan._id) return;
    const dto = this.getDTO();
    if (!dto) return;
    this.submitting = true;

    backend
      .put('nutritionplan/' + this.plan._id, dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }
  public deletePlan(): void {
    if (this.submitting) return;
    if (!this.plan) return;
    if (!this.plan._id) return;
    this.submitting = true;

    backend.delete('nutritionplan/' + this.plan._id);
    NutritionplanManagement.removePlan(this.plan._id);
    this.plan = null;
    this.$router.push({ name: 'nutritionplans' });
  }

  private handleResponse(res: { data: INutritionplan }): void {
    NutritionplanManagement.addPlan(res.data);
    this.plan = null;
    this.$router.push({ name: 'nutritionplans' });
  }

  private handleCatch(err: { statusCode: number; message: string }): void {
    const { statusCode, message } = err;
    if (statusCode && statusCode === 422 && message) {
      FHEventBus.$emit('fh-error-list-' + this.errorList, message);
    }
    this.submitting = false;
  }
}
</script>

<style lang="scss" scoped>
.fh-nutritionplan-form {
  padding-top: 10px;
  .title {
    font-weight: 700;
    white-space: nowrap;
    margin: 10px 0 2px;
    margin-left: 8px;
  }

  .day-time {
    margin-bottom: 10px;
    .day-time--title {
      opacity: 0.5;
      font-weight: 600;
    }
    .day-time-recipe {
      margin-top: 5px;
      display: grid;
      grid-template-columns: auto 1fr;
      grid-gap: 10px;
      .tc-avatar {
        height: 40px;
        width: 40px;
      }
      .recipe-title {
        font-weight: 600;
        font-size: 16px;

        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        white-space: pre-wrap;
      }
    }
  }
}
</style>
