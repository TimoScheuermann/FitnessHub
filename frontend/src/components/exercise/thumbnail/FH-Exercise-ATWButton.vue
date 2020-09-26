<template>
  <tc-button
    v-if="$store.getters.valid"
    class="fh-exercise-atw-button"
    :disabled="$store.getters.loading"
    variant="border"
    name="Workout"
    icon="plus"
    color="#000"
    background="#fff"
    @click.stop="addToWorkout"
  />
</template>

<script lang="ts">
import { EventBus } from '@/utils/eventbus';
import { IExerciseInfo } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHExerciseATWButton extends Vue {
  @Prop() info!: IExerciseInfo;

  public addToWorkout(): void {
    EventBus.$emit('modals-close');
    EventBus.$emit('modal-add-to-workout', this.info);
  }
}
</script>

<style lang="scss" scoped>
.fh-exercise-atw-button {
  position: absolute;
  right: 7px;
  bottom: 7px;
  & /deep/ i {
    color: inherit !important;
  }
}
</style>
