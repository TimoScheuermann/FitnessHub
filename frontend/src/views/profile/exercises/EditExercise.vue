<template>
  <div class="edit-exercise" content>
    <fh-exercise-form mode="edit" :exerciseInput="exercise" />
  </div>
</template>

<script lang="ts">
import FHExerciseForm from '@/components/exercise/FH-ExerciseForm.vue';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-exercise-form': FHExerciseForm
  }
})
export default class EditExercise extends Vue {
  get exercise(): IExercise {
    return (this.$store.getters.exercises as IExercise[]).filter(
      x => x._id === this.$route.params.id
    )[0];
  }
}
</script>
