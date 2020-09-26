<template>
  <div class="workouts" content>
    <tl-flow horizontal="space-between">
      <h1>Meine Workouts</h1>
      <tc-link tfcolor="success" @click="newWorkout">neu</tc-link>
    </tl-flow>
    <p v-if="$store.getters.workouts.length === 0">
      Du hast noch kein Workout erstellt. Erstelle eins, um Übungen zu
      kombinieren
    </p>
    <fh-workout-list :editbutton="true" @workout="openWorkout" v-else />
    <h1>Trainingsplan</h1>
    <tl-grid>
      <fh-todays-workout
        v-for="(d, index) in daynames"
        :key="d"
        :offset="index"
        :onlyPreview="true"
        :day="d"
        :spaceing="false"
      />
    </tl-grid>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { EventBus } from '@/utils/eventbus';
import FHWorkoutList from '@/components/workout/FH-WorkoutList.vue';
import { ITrainingplanFull, IWorkout } from '@/utils/interfaces';
import { days } from '@/utils/constants';
import FHTodaysWorkout from '@/components/workout/FH-TodaysWorkout.vue';

@Component({
  components: {
    'fh-workout-list': FHWorkoutList,
    'fh-todays-workout': FHTodaysWorkout
  }
})
export default class Workouts extends Vue {
  public daynames = days;

  public newWorkout(): void {
    EventBus.$emit('modal-create-workout');
  }

  get trainingplan(): ITrainingplanFull | null {
    return this.$store.getters.trainingplan;
  }

  public openWorkout(workout: IWorkout) {
    EventBus.$emit('modal-workout-details', workout);
  }
}
</script>
