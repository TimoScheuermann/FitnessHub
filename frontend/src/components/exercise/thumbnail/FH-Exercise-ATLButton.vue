<template>
  <tc-button
    v-if="$store.getters.valid"
    class="fh-exercise-atl-button"
    :disabled="$store.getters.loading"
    variant="border"
    icon="list"
    color="#000"
    background="#fff"
    @click.stop="addToList"
  />
</template>

<script lang="ts">
import { EventBus } from '@/utils/eventbus';
import {
  IExercise,
  IExerciseInfo,
  IExerciseShowcase
} from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHExerciseATLButton extends Vue {
  @Prop() info!: IExerciseInfo | IExercise;

  /**
   * adds an exercise to a temp. list
   */
  public addToList(): void {
    EventBus.$emit('modal-exercise-list', {
      _id: this.info._id,
      title: this.info.title,
      thumbnail: this.info.thumbnail,
      type:
        (this.info as IExerciseShowcase).type ||
        (this.info as IExercise).distance
          ? 'distance'
          : (this.info as IExercise).sets
          ? 'gym'
          : 'time'
    } as IExerciseShowcase);
  }
}
</script>

<style lang="scss" scoped>
.fh-exercise-atl-button {
  transition: all 0.2s ease-out;
  position: absolute;
  top: 7px;
  right: 7px;
  & /deep/ i {
    color: inherit !important;
  }
}
</style>
