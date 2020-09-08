import { IWorkout } from '@/utils/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';

@Component
export default class WorkoutSocketManager extends Vue {
  @Socket('workout')
  workoutUpdated(workout: IWorkout) {
    this.$store.commit('manageWorkout', workout);
  }

  @Socket('workout.remove')
  workoutRemoved(workout: IWorkout) {
    this.$store.commit('removeWorkout', workout);
  }
}
