<template>
  <div class="exercises" content>
    <h1>Historie</h1>
    <p>soon</p>

    <tl-flow horizontal="space-between">
      <h1>Meine</h1>
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
        <fh-exercise v-for="e in published" :key="e._id" :exercise="e" />
      </fh-carousel>
    </template>
    <template v-if="unpublished.length > 0">
      <div>
        <tc-badge :value="unpublished.length" position="inside">
          <h3>Eingereicht</h3>
        </tc-badge>
      </div>
      <fh-carousel>
        <fh-exercise v-for="e in unpublished" :key="e._id" :exercise="e" />
      </fh-carousel>
    </template>
    <template v-if="edited.length > 0">
      <div>
        <tc-badge :value="edited.length" position="inside">
          <h3>Änderungen</h3>
        </tc-badge>
      </div>
      <fh-carousel>
        <fh-exercise
          v-for="e in edited"
          :key="e._id"
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
}
</script>

<style lang="scss" scoped>
h3 {
  margin: 0;
}
</style>
