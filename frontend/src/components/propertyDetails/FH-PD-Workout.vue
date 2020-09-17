<template>
  <tl-grid class="fh-pd-workout" minWidth="200" v-if="workout">
    <div
      class="exercise"
      v-for="(e, i) in workout.exercises"
      :key="e._id + i"
      @click="openExerciseDetails(e)"
    >
      <img :src="e.thumbnail" alt="" />
      <i class="info ti-i-circle" />
      <fh-exercise-informations :info="e" />
      <fh-exercise-atw-button :info="e" />
    </div>
  </tl-grid>
</template>

<script lang="ts">
import { EventBus } from '@/utils/eventbus';
import { IExerciseInfo, IModalReturn, IWorkout } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHExerciseATWButton from '../exercise/thumbnail/FH-Exercise-ATWButton.vue';
import FHExerciseInformations from '../exercise/thumbnail/FH-Exercise-Informations.vue';

@Component({
  components: {
    'fh-exercise-informations': FHExerciseInformations,
    'fh-exercise-atw-button': FHExerciseATWButton
  }
})
export default class FHPropertyDetailsWorkout extends Vue {
  @Prop() workout!: IWorkout;

  public openExerciseDetails(exerciseInfo: IExerciseInfo) {
    EventBus.$emit('modals-close');
    EventBus.$emit('modal-exercise-details', exerciseInfo._id);
    if (this.$route.name !== 'training-workout') {
      EventBus.$emit('modal-exercise-details-return', {
        event: 'modal-workout-details',
        data: this.workout._id
      } as IModalReturn);
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-pd-workout {
  user-select: none;
  .exercise {
    position: relative;
    height: 200px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: $border-radius;
      filter: brightness(50%);
    }
    i.info {
      top: 10px;
      right: 10px;
      position: absolute;
    }
  }
}
</style>
