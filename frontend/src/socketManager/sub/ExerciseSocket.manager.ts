import { IExercise } from '@/utils/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';

@Component
export default class ExerciseSocketManager extends Vue {
  @Socket('exercise')
  exerciseChangedOrUpdated(data: IExercise) {
    this.$store.commit('addExercise', data);
  }

  @Socket('exercise.remove')
  removeExercise(data: IExercise) {
    this.$store.commit('removeExercise', data);
  }

  @Socket('exerciseSub.new')
  addSubmission(data: IExercise) {
    this.$store.commit('addSubmittedExercise', data);
  }

  @Socket('exerciseSub.remove')
  removeSubmission(data: IExercise) {
    this.$store.commit('removeSubmittedExercise', data);
  }
}
