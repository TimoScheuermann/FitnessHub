<template>
  <FHPreview
    v-if="plan"
    class="fh-nutritionplan-preview"
    :title="plan.title"
    @click="handleClick"
  >
    <FHWorkoutThumbnail slot="media" :exercises="recipes" />

    <div class="recipe-amount">
      <i class="ti-gastro-assistant" />
      <span>Rezepte: {{ recipes.length }}</span>
    </div>

    <template slot="action">
      <tc-action-item success icon="share" title="Teilen" @click="$sP(plan)" />
      <tc-action-item
        icon="i-circle-filled"
        title="Details"
        @click="handleClick"
      />
      <tc-action-item
        v-group.admin.moderator
        icon="pencil"
        title="Bearbeiten"
        alarm
        @click="$oFS('edit-nutritionplan', { id: plan._id })"
      />
    </template>
  </FHPreview>
</template>

<script lang="ts">
import { openFullscreen } from '@/utils/functions';
import { INutritionplan, IRecipe } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHPreview from '../FHPreview.vue';
import FHWorkoutThumbnail from '../training/FHWorkoutThumbnail.vue';

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];
const daytimes = ['breakfast', 'lunch', 'dinner'];
@Component({
  components: {
    FHPreview,
    FHWorkoutThumbnail
  }
})
export default class FHNutritionplanPreview extends Vue {
  @Prop() plan!: INutritionplan;

  public handleClick(): void {
    if (!this.plan || !this.plan._id) return;
    openFullscreen('nutritionplan', { id: this.plan._id });
  }

  get recipes(): IRecipe[] {
    if (!this.plan) return [];
    const recipes: IRecipe[] = [];
    days.forEach(d => {
      daytimes.forEach(dt => {
        // eslint-disable-next-line
        recipes.push((this.plan as any)[d][dt]);
      });
    });
    return recipes;
  }
}
</script>

<style lang="scss" scoped>
.fh-nutritionplan-preview {
  .recipe-amount {
    margin-left: 10px;
    opacity: 0.7;
    i {
      margin-right: 5px;
      font-size: 12px;
    }
    span {
      font-size: 14px;
    }
  }

  .fh-workout-thumbnail {
    height: 210px;
    border-radius: $border-radius $border-radius 0 0;
  }
}
</style>
