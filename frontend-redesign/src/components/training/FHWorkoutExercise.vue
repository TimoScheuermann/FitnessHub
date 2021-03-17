<template>
  <div class="fh-workout-exercise" v-if="exercise">
    <tl-flow>
      <tc-avatar border="rounded" :src="exercise.thumbnail" />
    </tl-flow>
    <div class="information">
      <tl-flow horizontal="space-between" vertical="start">
        <div class="title">{{ exercise.title }}</div>
        <tc-action :dark="$store.getters.darkmode">
          <tc-action-item
            success
            icon="share"
            title="Teilen"
            @click="$sE(exercise)"
          />
          <tc-action-item icon="plus" title="Workout" @click="addToWO" />
          <tc-action-item icon="list" title="Liste" @click="$aTL(exercise)" />
          <tc-action-item
            icon="i-circle-filled"
            title="Details"
            @click="$oFS('exercise-details', { id: exercise._id })"
          />
        </tc-action>
      </tl-flow>
      <div class="difficulty">
        <i
          v-for="(k, i) in Array(exercise.difficulty)"
          :key="i"
          class="ti-circle"
          :difficulty="exercise.difficulty"
        />
      </div>
      <div class="muscles">
        {{ exercise.affectedMuscles.join(', ') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ExerciseManagement } from '@/utils/ExerciseManagement';
import { IExerciseInfo } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHWorkoutExercise extends Vue {
  @Prop() exercise!: IExerciseInfo;

  public addToWO(): void {
    if (this.exercise) {
      ExerciseManagement.addToWorkout(this.exercise);
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-exercise {
  &:not(:last-child) {
    margin-bottom: 10px;
    padding-bottom: 10px;

    border-bottom: 1px solid rgba($color, 0.2);
    @media #{$isDark} {
      border-bottom: 1px solid rgba($color_dark, 0.2);
    }
  }

  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 5px;
  .information {
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .tl-flow {
      flex-wrap: nowrap;
    }
    .title {
      font-weight: bold;
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }
    .difficulty {
      i {
        margin-right: 5px;
        font-size: 10px;

        &[difficulty='1'] {
          color: $success;
        }
        &[difficulty='2'] {
          color: $alarm;
        }
        &[difficulty='3'] {
          color: $error;
        }
      }
    }
    .muscles {
      opacity: 0.75;
      font-style: italic;
    }
  }
}
</style>
