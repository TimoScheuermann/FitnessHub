<template>
  <tc-modal
    class="fh-modal-add-to-workout"
    title="Zu einem Workout hinzufügen"
    v-model="modalOpened"
    :dark="$store.getters.darkmode"
    @close="close"
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
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { CreateWorkoutDTO } from '@/utils/dtos';
import { EventBus } from '@/utils/eventbus';
import { IExercise, IModalReturn, IWorkout } from '@/utils/interfaces';
import { Component, Mixins } from 'vue-property-decorator';
import FHExerciseSearch from '../exercise/FH-ExerciseSearch.vue';
import FHExercise from '@/components/exercise/FH-Exercise.vue';
import FHWorkoutList from '../workout/FH-WorkoutList.vue';
import FHModalMixin from './FHModal.mixin';

@Component({
  components: {
    'fh-exercise': FHExercise,
    'fh-workout-list': FHWorkoutList,
    'fh-exercise-search': FHExerciseSearch
  }
})
export default class FHModalAddToWorkout extends Mixins(FHModalMixin) {
  public exercise: IExercise | null = null;

  mounted() {
    EventBus.$on('modal-add-to-workout', (exercise: IExercise) => {
      this.exercise = exercise;
      if (this.exercise) this.modalOpened = true;
    });
    EventBus.$on('modal-add-to-workout-return', (modalReturn: IModalReturn) => {
      this.modalReturn = modalReturn;
    });
  }

  public createWorkout() {
    this.modalOpened = false;
    EventBus.$emit('modal-create-workout');
    EventBus.$emit('modal-create-workout-return', {
      event: 'modal-add-to-workout',
      data: this.exercise
    });
  }

  /**
   * workout selected, adding exercises to workout
   */
  public useWorkout(workout: IWorkout) {
    if (this.exercise && this.modalOpened) {
      axios
        .put('workout/' + workout._id, {
          title: workout.title,
          exercises: [...workout.exercises.map(x => x._id), this.exercise._id]
        } as CreateWorkoutDTO)
        .then(this.close);
    }
  }
}
</script>
<style lang="scss" scoped>
.fh-modal-add-to-workout {
  &,
  * {
    user-select: none;
  }
}
</style>
