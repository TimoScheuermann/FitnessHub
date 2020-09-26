<template>
  <tc-button
    v-if="$store.getters.valid"
    class="fh-workout-start-button"
    :disabled="$store.getters.loading"
    variant="border"
    name="Workout starten"
    color="#000"
    background="#fff"
    @click.stop="startWorkout"
  />
</template>

<script lang="ts">
import { EventBus } from '@/utils/eventbus';
import { IExerciseShowcase, IWorkout } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHWorkoutStartButton extends Vue {
  @Prop() workout!: IWorkout;

  public startWorkout(): void {
    const transformed = this.workout.exercises.map(x => {
      return {
        _id: x._id,
        title: x.title,
        thumbnail: x.thumbnail,
        type: x.type
      } as IExerciseShowcase;
    });
    EventBus.$emit('modals-close');
    EventBus.$emit('modal-start-workout', transformed);
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-start-button {
  position: absolute;
  z-index: 10;
  right: 7px;
  bottom: 7px;
  & /deep/ i {
    color: inherit !important;
  }
}
</style>
