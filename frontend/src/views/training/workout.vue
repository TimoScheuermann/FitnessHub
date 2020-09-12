<template>
  <div class="workout">
    <div class="workout-hero" v-if="workout">
      <div class="image-bar" v-for="e in workout.exercises" :key="e._id">
        <img :src="e.thumbnail" alt="" />
      </div>
      <div class="title">
        <h1>{{ workout.title }}</h1>
      </div>
    </div>
    <div class="loading" v-if="!workout">
      <tc-spinner size="20" :dark="$store.getters.darkmode" />
    </div>
    <div v-else content>
      <h1>{{ workout.title }}</h1>
      <p>soon</p>
    </div>
  </div>
</template>

<script lang="ts">
import { IWorkout } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Workout extends Vue {
  @Prop() workout!: IWorkout | null;
}
</script>

<style lang="scss" scoped>
.workout-hero {
  height: calc(200px + env(safe-area-inset-top));
  display: flex;
  position: relative;
  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90vw;
    margin-top: calc(env(safe-area-inset-top) / 2);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(50%);
  }
}
</style>
