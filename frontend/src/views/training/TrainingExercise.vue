<template>
  <div class="training-exercise" content>
    <div class="loading-error" v-if="error">
      <div class="icon">
        <i class="ti-exclamation-triangle" />
      </div>
      <div class="title">Die Übung konnte nicht gefunden werden</div>
      <tl-flow>
        <tc-link routeName="training" tfcolor="success">
          Verfügbare Übungen ansehen
        </tc-link>
      </tl-flow>
    </div>

    <tl-flow v-else-if="!exercise" class="loading-active" flow="column">
      <tc-spinner :dark="$store.getters.darkmode" size="20" />
      <div class="loading-message">Daten werden geladen</div>
    </tl-flow>

    <fh-pd-exercise v-else :exercise="exercise" />
  </div>
</template>

<script lang="ts">
import FHPropertyDetailsExercise from '@/components/propertyDetails/FH-PD-Exercise.vue';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {
    'fh-pd-exercise': FHPropertyDetailsExercise
  }
})
export default class TrainingExercise extends Vue {
  @Prop() exercise!: IExercise;
  @Prop() error!: boolean;
}
</script>

<style lang="scss" scoped>
.training-exercise {
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
