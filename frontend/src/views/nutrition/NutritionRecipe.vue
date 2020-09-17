<template>
  <div class="nutrition-exercise" content>
    <div class="loading-error" v-if="error">
      <div class="icon">
        <i class="ti-exclamation-triangle" />
      </div>
      <div class="title">Das Rezept konnte nicht gefunden werden</div>
      <tl-flow>
        <tc-link routeName="nutrition" tfcolor="success">
          Verfügbare Rezepte ansehen
        </tc-link>
      </tl-flow>
    </div>

    <tl-flow v-else-if="!recipe" class="loading-active" flow="column">
      <tc-spinner :dark="$store.getters.darkmode" size="20" />
      <div class="loading-message">Daten werden geladen</div>
    </tl-flow>

    <fh-pd-recipe v-else :recipe="recipe" />
  </div>
</template>

<script lang="ts">
import FHPropertyDetailsRecipe from '@/components/propertyDetails/FH-PD-Recipe.vue';
import { IRecipe } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {
    'fh-pd-recipe': FHPropertyDetailsRecipe
  }
})
export default class TrainingExercise extends Vue {
  @Prop() recipe!: IRecipe;
  @Prop() error!: boolean;
}
</script>

<style lang="scss" scoped>
.nutrition-exercise {
  .loading-active {
    margin-top: 40px;
    .loading-message {
      opacity: 0.75;
      margin-top: 10px;
    }
  }
  .loading-error {
    margin-top: 40px;
    text-align: center;
    .icon {
      color: $error;
      font-size: 3em;
    }
    .title {
      margin-bottom: 20px;
      font-weight: bold;
      opacity: 0.75;
    }
  }
}
</style>
