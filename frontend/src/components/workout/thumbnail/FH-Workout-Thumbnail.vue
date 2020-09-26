<template>
  <div class="fh-workout-thumbnail" v-if="workout" :style="'--cells:' + cells">
    <div
      class="fh-workout-thumbnail--cell"
      v-for="(a, i) in displayedAssets"
      :key="a + i"
    >
      <img :src="a" alt="" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { IWorkout } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHWorkoutThumbnail extends Vue {
  @Prop() workout!: IWorkout;

  get assets(): string[] {
    if (!this.workout) return [];
    return this.workout.exercises
      .filter(x => x.thumbnail.startsWith('http'))
      .map(x => x.thumbnail);
  }

  get displayedAssets(): string[] {
    return this.assets.filter((x, i) => i < this.cells * this.cells);
  }

  get cells(): number {
    if (!this.workout) return 1;
    if (this.assets.length < 4) return 1;
    if (this.assets.length < 9) return 2;
    return 3;
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-thumbnail {
  display: grid;
  grid-template-columns: repeat(var(--cells), minmax(0px, 1fr));
  grid-template-rows: repeat(var(--cells), minmax(0px, 1fr));
  overflow: hidden;
  height: inherit;
  position: relative;
  .fh-workout-thumbnail--cell {
    img {
      width: 100%;
      height: 100%;
      // filter: brightness(50%);
      object-fit: cover;
    }
  }
}
</style>
