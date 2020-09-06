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
      title="Übung prüfen"
      :dark="$store.getters.darkmode"
      v-model="modalOpened"
    >
      <submit-exercise
        @closeModal="modalOpened = false"
        :exerciseEdit="selectedExercise"
        :editMode="mode"
      />
    </tc-modal>
  </div>
</template>

<script lang="ts">
import { formatDate } from '@/utils/functions';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import SubmitExercise from '../exercises/SubmitExercise.vue';

@Component({
  components: {
    'submit-exercise': SubmitExercise
  }
})
export default class SubmittedExercises extends Vue {
  public mode = 'publish';
  public modalOpened = false;
  public selectedExercise: IExercise | null = null;

  public transformDate(date: number): string {
    return formatDate(date);
  }

  public checkNew(exercise: IExercise) {
    this.mode = 'publish';
    this.selectedExercise = exercise;
    this.modalOpened = true;
  }

  public checkEdit(exercise: IExercise) {
    this.mode = 'edit';
    this.selectedExercise = exercise;
    this.modalOpened = true;
  }

  get submissions(): IExercise[] {
    return this.$store.getters.submittedExercises;
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
