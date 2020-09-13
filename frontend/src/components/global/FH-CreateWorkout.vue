<template>
  <tc-modal
    @close="closeing"
    class="fh-create-workout"
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
import { Vue, Component } from 'vue-property-decorator';
import FHExerciseSearch from '../exercise/FH-ExerciseSearch.vue';

@Component({
  components: {
    'fh-exercise-search': FHExerciseSearch
  }
})
export default class FHCreateWorkout extends Vue {
  public modalOpened = false;
  public title = '';
  public selectedExerxises: { id: string; name: string }[] = [];
  public modalReturn: IModalReturn | null = null;

  mounted() {
    EventBus.$on('create-workout', () => {
      this.title = '';
      this.selectedExerxises = [];
      this.modalOpened = true;
    });
    EventBus.$on('create-workout-return', (data: IModalReturn) => {
      this.modalReturn = data;
    });
  }

  public closeing(): void {
    if (this.modalReturn) {
      EventBus.$emit(this.modalReturn.event, this.modalReturn.data);
      this.modalReturn = null;
    }
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
    await axios.post('workout', {
      title: this.title,
      exercises: this.selectedExerxises.map(x => x.id)
    } as CreateWorkoutDTO);
    this.closeing();
    this.modalOpened = false;
  }
}
</script>

<style lang="scss" scoped></style>
