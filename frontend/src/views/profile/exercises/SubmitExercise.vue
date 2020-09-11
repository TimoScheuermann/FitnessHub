<template>
  <div class="submit-exercises" content>
    <fh-exercise-form />
  </div>
</template>

<script lang="ts">
import FHExerciseForm from '@/components/exercise/FH-ExerciseForm.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-exercise-form': FHExerciseForm
  }
})
export default class SubmitExercise extends Vue {}
</script>
