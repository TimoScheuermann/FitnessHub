<template>
  <div
    class="fh-workout-preview"
    :style="'--cells: ' + this.cells"
    v-if="workout"
  >
    <div class="container">
      <div class="title">{{ workout.title }}</div>
      <div class="date">{{ date }}</div>
    </div>
    <div
      class="exercise-image"
      v-for="(e, i) in workout.exercises.filter((x, i) => i < cells * cells)"
      :key="e._id + i"
    >
      <img :src="e.thumbnail" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { formatDate } from '@/utils/functions';
import { IWorkout } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHWorkoutPreview extends Vue {
  @Prop() workout!: IWorkout;

  get date(): string {
    if (!this.workout) return '';
    return formatDate(this.workout.updated);
  }

  get cells(): number {
    if (!this.workout) return 1;
    if (this.workout.exercises.length < 4) return 1;
    if (this.workout.exercises.length < 9) return 2;
    return 3;
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-preview {
  height: 200px;
  display: grid;
  grid-template-columns: repeat(var(--cells), minmax(0, 1fr));
  grid-template-rows: repeat(var(--cells), minmax(0, 1fr));
  border-radius: $border-radius;
  overflow: hidden;
  position: relative;

  .container {
    color: #fff;
    position: absolute;
    z-index: 2;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    .title {
      font-size: 1.3em;
      font-weight: 500;
    }
    .date {
      opacity: 0.7;
    }
  }

  .exercise-image {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(50%);
    }
  }
}
</style>
