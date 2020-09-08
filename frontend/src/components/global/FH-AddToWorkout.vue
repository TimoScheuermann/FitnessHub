<template>
  <div class="fh-add-to-workout">
    <tc-modal
      :title="exercise ? 'Zum Workout hinzufügen' : 'Workout erstellen'"
      v-if="display"
      v-model="modalOpened"
      :dark="$store.getters.darkmode"
    >
      <template v-if="exercise">
        <fh-exercise :exercise="exercise" :isInATWModal="true" />
        <h2>Workout wählen</h2>
        <fh-workout-list @workout="addExerciseTo" />
      </template>
      <template v-else>
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
        <tc-input
          :dark="$store.getters.darkmode"
          placeholder="Name, Muskel, etc."
          v-model="query"
          @input="search"
          icon="lens"
        />
        <br />
        <template v-if="searchResults.length > 0">
          <tc-list :dark="$store.getters.darkmode">
            <tc-list-item
              v-for="sr in searchResults"
              :title="sr.title"
              :key="sr._id"
              icon="plus"
              @click="addToList(sr._id, sr.title)"
            />
          </tc-list>
          <br />
        </template>
        <tl-grid>
          <tc-button
            name="Workout erstellen"
            icon="add"
            variant="filled"
            tfbackground="success"
            @click="createWorkout"
            :disabled="$store.getters.loading"
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
import { sendNotification } from '@/utils/functions';
import { IExercise, IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHExercise from '../shared/FH-Exercise.vue';
import FHWorkoutList from '../workout/FH-WorkoutList.vue';

@Component({
  components: {
    'fh-exercise': FHExercise,
    'fh-workout-list': FHWorkoutList
  }
})
export default class FHAddToWorkout extends Vue {
  public exercise: IExercise | null = null;
  public modalOpened = false;
  public display = false;
  public selectedExerxises: { id: string; name: string }[] = [];
  public searchResults: IExercise[] = [];
  public query = '';
  public title = '';

  mounted() {
    setTimeout(() => {
      this.display = true;
    }, 500);
    EventBus.$on('add-to-workout', (exercise: IExercise) => {
      this.exercise = exercise;
      this.query = '';
      this.title = '';
      this.selectedExerxises = [];
      this.searchResults = [];
      this.modalOpened = true;
    });
  }

  public search(query: string = this.query) {
    if (query.length > 0) {
      axios.get('exercise/find/' + query).then(res => {
        this.searchResults = res.data.filter(
          (x: IExercise) => !this.isInList(x._id)
        );
      });
    }
  }

  public isInList(id: string) {
    return this.selectedExerxises.filter(x => x.id === id).length === 1;
  }

  public addToList(id: string, title: string) {
    if (!this.isInList(id)) {
      this.selectedExerxises.push({ id: id, name: title });
      this.searchResults = this.searchResults.filter(x => x._id !== id);
    }
  }

  public removeFromList(id: string) {
    this.selectedExerxises = this.selectedExerxises.filter(x => x.id !== id);
    this.search();
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
    this.modalOpened = false;
  }

  public async addExerciseTo(workout: IWorkout): Promise<void> {
    if (this.exercise && !this.$store.getters.loading && this.modalOpened) {
      await axios.put('workout/' + workout._id, {
        title: workout.title,
        exercises: [...workout.exercises.map(x => x._id), this.exercise._id]
      } as CreateWorkoutDTO);

      this.modalOpened = false;
    }
  }
}
</script>
