<template>
  <tc-modal
    @close="close"
    class="fh-modal-create-workout"
    v-model="modalOpened"
    title="Workout erstellen"
    :dark="$store.getters.darkmode"
  >
    <tc-input
      title="Name des Workouts"
      v-model="title"
      :dark="$store.getters.darkmode"
    />

    <transition name="appear">
      <div v-if="selectedExerxises.length > 0">
        <h3>Ausgewählte Übungen</h3>
        <tc-list :dark="$store.getters.darkmode">
          <tc-list-item
            v-for="se in selectedExerxises"
            :key="se.id"
            :title="se.name"
            icon="minus"
            @click="removeFromList(se.id)"
          />
        </tc-list>
      </div>
    </transition>

    <h2>Übungen hinzufügen</h2>
    <fh-exercise-search
      @exercise="addToList"
      :skip="selectedExerxises.map(x => x.id)"
    />
    <br />
    <tl-grid>
      <tc-button
        :disabled="$store.getters.loading"
        name="Workout erstellen"
        icon="add"
        variant="filled"
        tfbackground="success"
        @click="createWorkout"
      />
    </tl-grid>
  </tc-modal>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { CreateWorkoutDTO } from '@/utils/dtos';
import { EventBus } from '@/utils/eventbus';
import { sendNotification } from '@/utils/functions';
import { IExercise, IModalReturn } from '@/utils/interfaces';
import { Component, Mixins } from 'vue-property-decorator';
import FHExerciseSearch from '../exercise/FH-ExerciseSearch.vue';
import FHModalMixin from './FHModal.mixin';

@Component({
  components: {
    'fh-exercise-search': FHExerciseSearch
  }
})
export default class FHModalCreateWorkout extends Mixins(FHModalMixin) {
  public title = '';
  public selectedExerxises: { id: string; name: string }[] = [];

  mounted() {
    EventBus.$on('modal-create-workout', () => {
      this.title = '';
      this.selectedExerxises = [];
      this.modalOpened = true;
    });
    EventBus.$on('modal-create-workout-return', (data: IModalReturn) => {
      this.modalReturn = data;
    });
  }

  public isInList(id: string) {
    return this.selectedExerxises.filter(x => x.id === id).length === 1;
  }

  public addToList(exercise: IExercise) {
    if (!this.isInList(exercise._id)) {
      this.selectedExerxises.push({ id: exercise._id, name: exercise.title });
    }
  }

  public removeFromList(id: string) {
    this.selectedExerxises = this.selectedExerxises.filter(x => x.id !== id);
  }

  public async createWorkout(): Promise<void> {
    if (this.title.length === 0) {
      sendNotification({
        title: 'Workout kann nicht erstellt werden',
        text: 'Bitte gib deinem Workout einen Namen'
      });
      return;
    }
    const data = {
      title: this.title,
      exercises: this.selectedExerxises.map(x => x.id)
    } as CreateWorkoutDTO;

    axios.post('workout', data).then(this.close);
  }
}
</script>
<style lang="scss" scoped>
.fh-modal-create-workout {
  &,
  * {
    user-select: none;
  }
}
</style>
