<template>
  <div class="fh-workout-informations">
    <fh-difficulty :difficulty="difficulty" />
    <div class="title">Workout: {{ workout.title }}</div>
  </div>
</template>

<script lang="ts">
import FHDifficulty from '@/components/common/FH-Difficulty.vue';
import { IWorkout } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {
    'fh-difficulty': FHDifficulty
  }
})
export default class FHworkoutInformations extends Vue {
  @Prop() workout!: IWorkout;

  get difficulty(): number {
    if (!this.workout) return 0;
    return (
      this.workout.exercises.map(x => x.difficulty).reduce((a, b) => a + b, 0) /
      this.workout.exercises.length
    );
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-informations {
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px;
  position: flex;
  flex-direction: column;

  .title {
    margin: 5px 0;
    font-weight: 500;
    font-size: 1.3em;
    color: #fff;
  }
}
</style>
