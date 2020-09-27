<template>
  <div class="edit-workout" content v-if="workout">
    <h3>Name des Workouts</h3>
    <div class="edit-name-grid">
      <tc-input v-model="title" :dark="$store.getters.darkmode" />
      <tc-button
        :disabled="title === workout.title || title.length === 0"
        name="Speichern"
        tfbackground="success"
        variant="filled"
        @click="updateName"
      />
    </div>

    <h3>Übungen bearbeiten</h3>
    <tc-segments :dark="$store.getters.darkmode" @input="changeMode">
      <tc-segment-item title="Reihenfolge" />
      <tc-segment-item title="Löschen" />
    </tc-segments>

    <fh-exercise-list :dark="$store.getters.darkmode">
      <fh-exercise-list-item
        v-for="(e, index) in workout.exercises"
        :key="e._id"
        :showDifficulty="false"
        :exercise="e"
        :class="{ drag: arrangeMode }"
      >
        <div
          v-if="deleteMode"
          class="delete-icon"
          slot="front"
          @click="deleteExercise(index)"
        >
          <i class="ti-cross-inverted" />
        </div>
        <div v-if="arrangeMode" class="arrange-icon">
          <i class="ti-align-justify" />
        </div>
      </fh-exercise-list-item>
    </fh-exercise-list>
  </div>
</template>

<script lang="ts">
import { IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import { Sortable } from '@shopify/draggable';
import axios from '@/utils/axios';
import { CreateWorkoutDTO } from '@/utils/dtos';
import FHExerciseList from '@/components/shared/exercise-list/FH-ExerciseList.vue';
import FHExerciseListItem from '@/components/shared/exercise-list/FH-ExerciseListItem.vue';

@Component({
  components: {
    'fh-exercise-list': FHExerciseList,
    'fh-exercise-list-item': FHExerciseListItem
  }
})
export default class EditWorkout extends Vue {
  public deleteMode = false;
  public arrangeMode = false;
  public title = '';

  get workout(): IWorkout {
    return this.$store.getters.workouts.filter(
      (x: IWorkout) => x._id === this.$route.params.id
    )[0];
  }

  get names(): string[] {
    return this.workout.exercises.map(x => x.title);
  }

  public changeMode(to: number) {
    this.arrangeMode = to === 0;
    this.deleteMode = to !== 0;
  }

  public deleteExercise(index: number): void {
    const update = { ...this.workout };
    update.exercises.splice(index, 1);
    this.updateWorkout(update);
  }

  mounted() {
    this.title = this.workout.title;
    setTimeout(() => {
      this.startDrag();
    }, 100);
  }

  public startDrag(): void {
    const sortable = new Sortable(
      document.querySelectorAll('.fh-exercise-list'),
      { draggable: '.fh-exercise-list-item.drag' }
    );
    sortable.on(
      'sortable:stop',
      (e: { oldIndex: number; newIndex: number }) => {
        const update = { ...this.workout };
        const save = update.exercises.splice(e.oldIndex, 1)[0];
        update.exercises.splice(e.newIndex, 0, save);
        this.updateWorkout(update);
      }
    );
  }

  public updateName() {
    this.workout.title = this.title;
    this.updateWorkout(this.workout);
  }

  public updateWorkout(update: IWorkout) {
    axios.put('workout/' + this.workout._id, {
      title: update.title,
      exercises: update.exercises.map(x => x._id)
    } as CreateWorkoutDTO);
  }
}
</script>

<style lang="scss" scoped>
.fh-exercise-list-item {
  .delete-icon {
    color: $error;
    font-size: 20px;
    height: 60px;
    padding-left: 10px;
    display: grid;
    place-content: center;
  }
  .arrange-icon {
    opacity: 0.75;
    padding: 0 5px;
  }
}
.edit-name-grid {
  display: grid;
  grid-template-columns: minmax(0px, 1fr) auto;
}
</style>
