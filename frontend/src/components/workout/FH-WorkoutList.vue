<template>
  <tl-grid class="fh-workout-list">
    <div
      class="workout"
      v-for="w in $store.getters.workouts"
      :key="w._id"
      @click="workoutSelected(w)"
    >
      <div class="thumbnail">
        <img
          v-if="w.exercises.length > 0"
          :src="w.exercises[0].thumbnail"
          alt=""
        />
      </div>
      <tl-flow flow="column" vertical="start" class="info">
        <div class="title">{{ w.title }}</div>
        <div class="exercise-amount">{{ w.exercises.length }} Übungen</div>
      </tl-flow>
      <tl-flow v-if="editbutton">
        <tc-button
          icon="pencil"
          tfbackground="success"
          variant="filled"
          :to="{ name: 'workout-edit', params: { id: w._id } }"
        />
      </tl-flow>
    </div>
  </tl-grid>
</template>

<script lang="ts">
import { IWorkout } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHWorkoutList extends Vue {
  @Prop({ default: false }) editbutton!: boolean;

  public getCellsAmount(workout: IWorkout): number {
    if (workout.exercises.length >= 4) return 2;
    if (workout.exercises.length >= 9) return 3;
    return 1;
  }
  public workoutSelected(workout: IWorkout): void {
    this.$emit('workout', workout);
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-list {
  .workout {
    background: $paragraph;
    @media (prefers-color-scheme: dark) {
      background: $paragraph_dark;
    }
    border-radius: $border-radius;

    padding: 10px;
    $scale: 75px;
    display: grid;
    grid-template-columns: $scale minmax(0px, 1fr) auto;
    grid-gap: 10px;
    .thumbnail {
      display: flex;
      border-radius: $border-radius;
      overflow: hidden;
      width: $scale;
      height: $scale;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .info {
      .title {
        font-weight: bold;
      }
      .exercise-amount {
        margin-top: 5px;
        opacity: 0.5;
      }
    }
  }
}
</style>
