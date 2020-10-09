<template>
  <tc-modal
    @close="close"
    v-model="modalOpened"
    :dark="$store.getters.darkmode"
    class="fh-modal-workout-details"
  >
    <div class="loading-error" v-if="error">
      <div class="icon">
        <i class="ti-exclamation-triangle" />
      </div>
      <div class="title">Das Workout konnte nicht gefunden werden</div>
      <tl-flow>
        <tc-link routeName="training" tfcolor="success">
          Verfügbare Workouts ansehen
        </tc-link>
      </tl-flow>
    </div>

    <tl-flow v-else-if="!workout" content class="loading-active" flow="column">
      <tc-spinner :dark="$store.getters.darkmode" size="20" />
      <div class="loading-message">Daten werden geladen</div>
    </tl-flow>

    <div class="content" v-else>
      <fh-workout-head :user="user" :workout="workout" />

      <fh-exercise-list>
        <fh-exercise-list-item
          v-for="(e, i) in workout.exercises"
          :key="e._id + i"
          :exercise="e"
          @click="showExercise(e)"
        />
      </fh-exercise-list>
    </div>
  </tc-modal>
</template>

<script lang="ts">
import { EventBus } from '@/utils/eventbus';
import { getWorkout } from '@/utils/functions';
import {
  IWorkout,
  IModalReturn,
  IUser,
  IUserInfo,
  IExerciseInfo
} from '@/utils/interfaces';
import { Component, Mixins } from 'vue-property-decorator';
import FHExerciseListItem from '../shared/exercise-list/FH-ExerciseListItem.vue';
import FHExerciseList from '../shared/exercise-list/FH-ExerciseList.vue';
import FHWorkoutHead from '../workout/common/FH-Workout-Head.vue';
import FHModalMixin from './FHModal.mixin';

@Component({
  components: {
    'fh-workout-head': FHWorkoutHead,
    'fh-exercise-list': FHExerciseList,
    'fh-exercise-list-item': FHExerciseListItem
  }
})
export default class FHModalWorkoutDetails extends Mixins(FHModalMixin) {
  public error = false;
  public workout: IWorkout | null = null;
  public user: IUser | IUserInfo | null = null;

  mounted() {
    EventBus.$on('modal-workout-details', this.open);
    EventBus.$on(
      'modal-workout-details-return',
      (modalReturn: IModalReturn) => {
        this.modalReturn = modalReturn;
      }
    );
  }

  public showExercise(ex: IExerciseInfo): void {
    this.close();
    EventBus.$emit('modal-exercise-details', ex._id);
    EventBus.$emit('modal-exercise-details-return', {
      event: 'modal-workout-details',
      data: this.workout
    } as IModalReturn);
  }

  public open(w: string | IWorkout): void {
    this.error = false;
    if (typeof w === 'object') {
      this.workout = w;
      this.modalOpened = true;
    } else if (!this.workout || this.workout._id !== w) {
      this.modalOpened = true;
      getWorkout(w, (workout: IWorkout | null) => {
        this.error = !workout;
        if (workout) {
          this.workout = workout;
        }
      });
    }
    if (this.workout) {
      const me = this.$store.getters.user;
      if (this.workout.author === me._id) {
        this.user = me;
      } else {
        this.user = null;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-modal-workout-details {
  &,
  * {
    user-select: none;
  }
  /deep/ .tc-modal--head {
    padding: unset;
  }
  .loading-active {
    margin-top: 40px;
    .loading-message {
      opacity: 0.75;
      margin-top: 10px;
    }
  }
  .loading-error {
    margin-top: 40px;
    text-align: center;
    .icon {
      color: $error;
      font-size: 3em;
    }
    .title {
      margin-bottom: 20px;
      font-weight: bold;
      opacity: 0.75;
    }
  }
  .content {
    margin: 0 -5vw;
    .fh-exercise-list {
      margin: 5vw 5vw 0;
    }
  }
}
</style>
