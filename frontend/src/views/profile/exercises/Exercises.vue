<template>
  <div class="exercises" content>
    <h1>Zuletzt ausgeübt</h1>
    <template v-if="recent.length > 0">
      <fh-carousel>
        <fh-exercise v-for="(e, i) in recent" :key="e._id + i" :exercise="e" />
      </fh-carousel>
      <br />
      <tc-button
        icon="chart-bar"
        name="Trainingsstatistik"
        tfbackground="success"
        variant="filled"
        routeName="highlights"
      />
    </template>
    <template v-else>
      <p>Du hast noch kein Übung mit FitnessHub ausgeübt.</p>
      <tc-button
        name="Übung beginnen"
        icon="gym"
        variant="filled"
        tfbackground="success"
        routeName="training"
      />
    </template>

    <tl-flow horizontal="space-between">
      <h1>Eingereicht</h1>
      <tc-link tfcolor="success" routeName="submitExercise">
        Übung einreichen
      </tc-link>
    </tl-flow>

    <template v-if="published.length > 0">
      <div>
        <tc-badge :value="published.length" position="inside">
          <h3>Veröffentlicht</h3>
        </tc-badge>
      </div>
      <fh-carousel>
        <fh-exercise v-for="e in published" :key="e._id + 'p'" :exercise="e" />
      </fh-carousel>
    </template>
    <template v-if="unpublished.length > 0">
      <div>
        <tc-badge :value="unpublished.length" position="inside">
          <h3>Werden aktuell geprüft</h3>
        </tc-badge>
      </div>
      <fh-carousel>
        <fh-exercise
          v-for="e in unpublished"
          :key="e._id + 's'"
          :exercise="e"
        />
      </fh-carousel>
    </template>
    <template v-if="edited.length > 0">
      <div>
        <tc-badge :value="edited.length" position="inside">
          <h3>Änderungen eingreicht</h3>
        </tc-badge>
      </div>
      <fh-carousel>
        <fh-exercise
          v-for="e in edited"
          :key="e._id + 'e'"
          :exercise="{ ...e, ...e.editedData }"
        />
      </fh-carousel>
    </template>
    <div class="spacer" />
  </div>
</template>

<script lang="ts">
import FHExercise from '@/components/shared/FH-Exercise.vue';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-exercise': FHExercise
  }
})
export default class Exercises extends Vue {
  get exercises(): IExercise[] {
    return this.$store.getters.exercises;
  }
  get published(): IExercise[] {
    return this.exercises.filter(x => x.reviewed);
  }
  get unpublished(): IExercise[] {
    return this.exercises.filter(x => !x.reviewed);
  }
  get edited(): IExercise[] {
    return this.exercises.filter(x => x.editedData);
  }
  get recent(): IExercise[] {
    return this.$store.getters.recentExercises;
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin: 0;
}
</style>
