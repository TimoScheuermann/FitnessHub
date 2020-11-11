import { IWorkout } from '@/utils/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';

@Component
export default class WorkoutSocketManager extends Vue {
  /**
   * new workout added
   * @param workout
   */
  @Socket('workout')
  workoutUpdated(workout: IWorkout) {
    this.$store.commit('manageWorkout', workout);
  }

  /**
   * workout removed
   * @param workout
   */
  @Socket('workout.remove')
  workoutRemoved(workout: IWorkout) {
    this.$store.commit('removeWorkout', workout);
  }
}
