<template>
  <div class="submitted-exercises" content>
    <h1>Neu eingereicht</h1>
    <p v-if="newSubmissions.length === 0">
      Es liegen keine eingereichten Übungen vor
    </p>
    <tc-table v-else :dark="$store.getters.darkmode">
      <template slot="head">
        <tc-th>Titel</tc-th>
        <tc-th>Datum</tc-th>
      </template>
      <tc-tr v-for="e in newSubmissions" :key="e._id" @click="checkNew(e)">
        <tc-td>{{ e.title }}</tc-td>
        <tc-td>{{ transformDate(e.created) }}</tc-td>
      </tc-tr>
    </tc-table>
    <h1>Änderungen</h1>
    <p v-if="editedSubmissions.length === 0">
      Es liegen keine Änderungsanträge vor
    </p>
    <tc-table v-else :dark="$store.getters.darkmode">
      <template slot="head">
        <tc-th>Titel</tc-th>
        <tc-th>Datum</tc-th>
      </template>
      <tc-tr v-for="e in editedSubmissions" :key="e._id" @click="checkEdit(e)">
        <tc-td>{{ e.title }}</tc-td>
        <tc-td>{{ transformDate(e.created) }}</tc-td>
      </tc-tr>
    </tc-table>

    <tc-modal
      v-if="mode.length > 0"
      title="Übung prüfen"
      :dark="$store.getters.darkmode"
      v-model="modalOpened"
    >
      <fh-exercise-form
        @closeModal="modalOpened = false"
        :key="selectedExercise._id"
        :exerciseInput="selectedExercise"
        :mode="mode"
      />
    </tc-modal>
  </div>
</template>

<script lang="ts">
import FHExerciseForm from '@/components/exercise/FH-ExerciseForm.vue';
import { formatDate } from '@/utils/functions';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-exercise-form': FHExerciseForm
  }
})
export default class SubmittedExercises extends Vue {
  public mode = '';
  public modalOpened = false;
  public selectedExercise: IExercise | null = null;

  public transformDate(date: number): string {
    return formatDate(date);
  }

  public checkNew(exercise: IExercise) {
    this.mode = 'publish';
    this.open(exercise);
  }

  public checkEdit(exercise: IExercise) {
    this.mode = 'publishEdit';
    this.open(exercise);
  }

  private open(exercise: IExercise) {
    this.selectedExercise = exercise;
    setTimeout(() => {
      this.modalOpened = true;
    }, 100);
  }

  get submissions(): IExercise[] {
    return this.$store.getters.exerciseSubmissions;
  }

  get newSubmissions(): IExercise[] {
    return this.submissions.filter(x => !x.reviewed);
  }
  get editedSubmissions(): IExercise[] {
    return this.submissions.filter(x => x.reviewed);
  }
}
</script>

<style lang="scss" scoped></style>
