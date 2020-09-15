<template>
  <div class="fh-pd-exercise" v-if="exercise">
    <h3>Betroffene Muskeln</h3>
    <div class="muscles">
      <div
        class="muscle"
        v-for="m in exercise.affectedMuscles"
        :key="m"
        @click="showTrainingsFor(m)"
      >
        {{ m }}
      </div>
    </div>
    <h3>Volumen</h3>
    <template v-if="exercise.reps">
      <ul>
        <li>Sätze: {{ exercise.sets }}</li>
        <li>Wiederholungen: {{ exercise.reps }}</li>
      </ul>
    </template>
    <template v-else-if="exercise.distance">
      <ul>
        <li>Strecke: {{ exercise.distance }}</li>
      </ul>
    </template>
    <template v-else-if="exercise.time">
      <ul>
        <li>Dauer: {{ time }}</li>
      </ul>
    </template>
    <template v-if="exercise.warnings.length > 0">
      <h3>Hinweise</h3>
      <ul>
        <li v-for="h in exercise.warnings" :key="h">{{ h }}</li>
      </ul>
    </template>

    <template v-if="exercise.steps.length > 0">
      <h3>Ausführung</h3>
      <tc-steps
        :dark="$store.getters.darkmode"
        direction="column"
        :current="99"
      >
        <tc-step-item v-for="s in exercise.steps" :key="s" :title="s" />
      </tc-steps>
    </template>

    <tl-grid edit v-if="isAuthor">
      <tc-button
        :disabled="$store.getters.loading"
        variant="filled"
        tfbackground="success"
        name="Übung bearbeiten"
        icon="tools"
        :to="{ name: 'editExercise', params: { id: exercise._id } }"
      />
    </tl-grid>
  </div>
</template>

<script lang="ts">
import { IExercise } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHPropertyDetailsExercise extends Vue {
  @Prop() exercise!: IExercise;

  get isAuthor(): boolean {
    return (
      this.$store.getters.valid &&
      this.exercise.author === this.$store.getters.user._id &&
      this.exercise.reviewed
    );
  }

  get time(): string {
    if (this.exercise) {
      const time = this.exercise.time || 0;
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor(time / 60) - hours * 60;
      const seconds = time % 60;

      const times = [];
      if (hours > 0) times.push(hours + 'h');
      if (minutes > 0) times.push(minutes + 'm');
      if (seconds > 0) times.push(seconds + 's');
      return times.join(' ');
    }
    return '';
  }

  public showTrainingsFor(muscle: string) {
    this.$router.push({ name: 'training-muscle', params: { muscle: muscle } });
  }
}
</script>

<style lang="scss" scoped>
.fh-pd-exercise {
  .muscles {
    margin: 0 -3px;
    .muscle {
      padding: 2.5px 12.5px;
      box-sizing: border-box;
      border: 2px solid rgba($color, 0.25);
      &:hover {
        background: $color;
        color: $color_dark;
      }
      @media (prefers-color-scheme: dark) {
        border-color: rgba($color_dark, 0.5);
        &:hover {
          background: $color_dark;
          color: $color;
        }
      }
      border-radius: $border-radius;
      display: inline-block;
      margin: 3px;
      cursor: pointer;
      transition: 0.2s ease-in-out;
    }
  }
}
</style>
