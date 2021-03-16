<template>
  <div
    class="fh-workout-thumbnail"
    v-if="exercises"
    :thumbnails="thumbnails.length"
  >
    <div
      class="exercise-thumbnail"
      v-for="(t, i) in thumbnails"
      :key="i"
      :style="`background-image: url('${t}')`"
    />
  </div>
</template>

<script lang="ts">
import { IExercise, IExerciseInfo, IRecipe } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHWorkoutThumbnail extends Vue {
  @Prop() exercises!: (IExercise | IExerciseInfo | IRecipe)[];

  get thumbnails(): string[] {
    if (!this.exercises) return [];
    const { length } = this.exercises;
    if (length === 0) return [];

    let selection: (IExercise | IExerciseInfo | IRecipe)[] = [];
    if (length < 4) selection = this.exercises.slice(0, 1);
    else if (length < 9) selection = this.exercises.slice(0, 4);
    else if (length < 16) selection = this.exercises.slice(0, 9);
    else selection = this.exercises.slice(0, 16);
    return selection.map(x => x.thumbnail);
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-thumbnail {
  overflow: hidden;
  border-radius: $border-radius;
  display: grid;

  &[thumbnails='1'] {
    grid-template-columns: 1fr;
  }
  &[thumbnails='4'] {
    grid-template-columns: 1fr 1fr;
  }
  &[thumbnails='9'] {
    grid-template-columns: 1fr 1fr 1fr;
  }
  &[thumbnails='16'] {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  div {
    background-position: center;
    background-size: cover;
  }
}
</style>
