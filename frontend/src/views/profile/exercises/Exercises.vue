<template>
  <div class="exercises" content>
    <h1>Letzte Übungen</h1>
    <p>soon</p>

    <tl-flow horizontal="space-between">
      <h1>Eingereicht - {{ exercises.length }}</h1>
      <tc-link tfcolor="success" routeName="submitExercise">neu</tc-link>
    </tl-flow>
    <tl-grid>
      <tc-revealer
        :title="'Veröffentlicht - ' + published.length"
        :dark="$store.getters.darkmode"
        highlight="success"
        v-if="published.length > 0"
      >
        <tl-grid insideR>
          <fh-exercise v-for="e in published" :key="e._id" :exercise="e" />
        </tl-grid>
      </tc-revealer>

      <tc-revealer
        :title="'Warten auf Veröffentlichung - ' + unpublished.length"
        :dark="$store.getters.darkmode"
        highlight="success"
        v-if="unpublished.length > 0"
      >
        <tl-grid insideR>
          <fh-exercise v-for="e in unpublished" :key="e._id" :exercise="e" />
        </tl-grid>
      </tc-revealer>

      <tc-revealer
        :title="'Änderungen werden geprüft - ' + edited.length"
        :dark="$store.getters.darkmode"
        highlight="success"
        v-if="edited.length > 0"
      >
        <tl-grid insideR>
          <fh-exercise v-for="e in edited" :key="e._id" :exercise="e" />
        </tl-grid>
      </tc-revealer>
    </tl-grid>
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
.tl-flow {
  margin-top: 20px;
  h1 {
    margin: 0;
  }
}
.tl-grid[insideR] {
  margin-top: 20px;
}
</style>
