<template>
  <tl-grid class="fh-workout-list" gap="10px 20" arrangement="auto-fill">
    <div
      class="workout"
      v-for="w in workouts"
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
          :disabled="$store.getters.loading"
          icon="pencil"
          tfbackground="success"
          variant="filled"
          @click.prevent.stop="editWorkout(w)"
        />
        <tc-button
          :disabled="$store.getters.loading"
          icon="cross"
          tfbackground="error"
          variant="filled"
          @click.prevent.stop="deleteWorkout(w)"
        />
      </tl-flow>
    </div>
  </tl-grid>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { IWorkout } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHWorkoutList extends Vue {
  @Prop({ default: false }) editbutton!: boolean;
  @Prop() showOnly!: string;

  get workouts(): IWorkout[] {
    const workouts: IWorkout[] = this.$store.getters.workouts;
    if (!this.showOnly) return workouts;
    return workouts.filter(x => x._id === this.showOnly);
  }

  public getCellsAmount(workout: IWorkout): number {
    if (workout.exercises.length >= 4) return 2;
    if (workout.exercises.length >= 9) return 3;
    return 1;
  }

  public workoutSelected(workout: IWorkout): void {
    this.$emit('workout', workout);
  }

  public editWorkout(workout: IWorkout) {
    this.$router.push({ name: 'workout-edit', params: { id: workout._id } });
  }

  public deleteWorkout(workout: IWorkout) {
    if (!this.$store.getters.loading) {
      axios.delete('workout/' + workout._id).then(() => {
        axios.get('trainingplan/full').then(res => {
          this.$store.commit('setTrainingplan', res.data);
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-list {
  user-select: none;
  .workout {
    cursor: pointer;
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
