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
    <fh-workout-list :editbutton="true" v-else />
    <h1>Trainingsplan</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { EventBus } from '@/utils/eventbus';
import FHWorkoutList from '@/components/workout/FH-WorkoutList.vue';

@Component({
  components: {
    'fh-workout-list': FHWorkoutList
  }
})
export default class Workouts extends Vue {
  public newWorkout(): void {
    EventBus.$emit('add-to-workout', null);
  }
}
</script>

<style lang="scss" scoped></style>
