<template>
  <div class="training-muscle" content>
    <h3>Übungen</h3>
    <tl-grid>
      <fh-exercise-two v-for="ex in exercises" :key="ex._id" :exercise="ex" />
    </tl-grid>
  </div>
</template>

<script lang="ts">
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHExercise from '@/components/exercise/FH-Exercise.vue';
import axios from '@/utils/axios';
import FHExerciseTwo from '@/components/exercise/FH-Exercise-Two.vue';

@Component({
  components: {
    'fh-exercise': FHExercise,
    'fh-exercise-two': FHExerciseTwo
  }
})
export default class TrainingMuscle extends Vue {
  private exercises: IExercise[] = [];

  async mounted() {
    this.exercises = (await axios.get('exercise/muscle/' + this.muscle)).data;
  }

  get muscle(): string {
    return this.$route.params.muscle;
  }
}
</script>
