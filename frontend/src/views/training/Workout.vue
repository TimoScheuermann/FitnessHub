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
      <tl-grid>
        <fh-exercise v-for="e in exercises" :key="e._id" :id="e._id" />
      </tl-grid>
    </div>
  </div>
</template>

<script lang="ts">
import FHExercise from '@/components/shared/FH-Exercise.vue';
import { IExerciseInfo, IWorkout } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {
    'fh-exercise': FHExercise
  }
})
export default class Workout extends Vue {
  @Prop() workout!: IWorkout | null;

  get exercises(): IExerciseInfo[] {
    if (!this.workout) return [];
    return this.workout.exercises;
  }
}
</script>

<style lang="scss" scoped>
@keyframes hero-anim {
  from {
    max-width: 0vw;
  }
  to {
    max-width: 100vw;
  }
}
.workout-hero {
  margin-top: -200px;
  height: 200px;
  @media #{$isDesktop} {
    margin-top: -250px;
    height: 250px;
  }
  .image-bar {
    animation: hero-anim 1s ease-out 0.2s both;
  }

  display: flex;
  justify-content: center;
  position: relative;
  .title {
    position: absolute;
    text-align: center;
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
