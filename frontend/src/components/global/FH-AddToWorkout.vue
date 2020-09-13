<template>
  <div class="fh-add-to-workout">
    <tc-modal
      title="Zu einem Workout hinzufügen"
      v-model="modalOpened"
      :dark="$store.getters.darkmode"
    >
      <fh-exercise :exercise="exercise" :isInATWModal="true" />
      <h2>Workout wählen</h2>
      <template v-if="$store.getters.workouts.length > 0">
        <fh-workout-list @workout="useWorkout" />
        <br />
        <tl-grid>
          <tc-button
            :disabled="$store.getters.loading"
            variant="filled"
            tfbackground="success"
            name="Neues Workout erstellen"
            icon="gym"
            @click="createWorkout"
          />
        </tl-grid>
      </template>
      <template v-else>
        <p>Du hast noch kein Workout erstellt...</p>
        <tl-grid>
          <tc-button
            :disabled="$store.getters.loading"
            variant="filled"
            tfbackground="success"
            name="Workout erstellen"
            icon="gym"
            @click="createWorkout"
          />
        </tl-grid>
      </template>
    </tc-modal>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { CreateWorkoutDTO } from '@/utils/dtos';
import { EventBus } from '@/utils/eventbus';
import { IExercise, IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHExerciseSearch from '../exercise/FH-ExerciseSearch.vue';
import FHExercise from '../shared/FH-Exercise.vue';
import FHWorkoutList from '../workout/FH-WorkoutList.vue';

@Component({
  components: {
    'fh-exercise': FHExercise,
    'fh-workout-list': FHWorkoutList,
    'fh-exercise-search': FHExerciseSearch
  }
})
export default class FHAddToWorkout extends Vue {
  public exercise: IExercise | null = null;
  public modalOpened = false;

  mounted() {
    EventBus.$on('add-to-workout', (exercise: IExercise) => {
      this.exercise = exercise;
      if (this.exercise) this.modalOpened = true;
    });
  }

  public createWorkout() {
    this.modalOpened = false;
    EventBus.$emit('create-workout');
    EventBus.$emit('create-workout-return', {
      event: 'add-to-workout',
      data: this.exercise
    });
  }

  public useWorkout(workout: IWorkout) {
    if (this.exercise && this.modalOpened) {
      axios
        .put('workout/' + workout._id, {
          title: workout.title,
          exercises: [...workout.exercises.map(x => x._id), this.exercise._id]
        } as CreateWorkoutDTO)
        .then(() => {
          this.modalOpened = false;
        });
    }
  }
}
</script>
