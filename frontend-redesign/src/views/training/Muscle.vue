<template>
  <div class="view-muscle-exercises" content>
    <tl-flow v-if="!exercises" flow="column">
      <tc-spinner
        variant="dots-spin"
        size="30"
        :dark="$store.getters.darkmode"
      />
      <p>Übungen werden geladen...</p>
    </tl-flow>
    <tl-flow v-else-if="exercises.length === 0" flow="column">
      <i huge error class="ti-exclamation-triangle" />
      <p>Es wurde keine Übung gefunden</p>
    </tl-flow>

    <div v-else max-width>
      <FHHeading subtitle="Ergebnisse für" :title="this.$route.params.muscle" />
      <br />

      <masonry :cols="{ default: 3, 750: 2, 500: 1 }" gutter="20px">
        <FHExercisePreview v-for="e in exercises" :key="e._id" :exercise="e" />
      </masonry>
    </div>
  </div>
</template>

<script lang="ts">
import FHHeading from '@/components/FHHeading.vue';
import FHExercisePreview from '@/components/training/FHExercisePreview.vue';
import backend from '@/utils/backend';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHExercisePreview,
    FHHeading
  }
})
export default class MuscleExercises extends Vue {
  public exercises: IExercise[] | null = null;

  mounted() {
    backend
      .get('exercise/muscle/' + this.$route.params.muscle)
      .then(res => {
        this.exercises = res.data;
      })
      .catch(() => {
        this.$router.push({ name: 'training' });
      });
  }
}
</script>
<style lang="scss" scoped>
.view-muscle-exercises {
  .fh-exercise-preview {
    margin-bottom: 20px;
  }
}
</style>
