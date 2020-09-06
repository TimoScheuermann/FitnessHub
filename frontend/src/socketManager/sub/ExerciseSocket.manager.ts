import { IExercise } from '@/utils/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';

@Component
export default class ExerciseSocketManager extends Vue {
  @Socket('exercise')
  manageExercise(data: IExercise) {
    this.$store.commit('manageExercise', data);
  }

  @Socket('exercise.remove')
  removeExercise(data: IExercise) {
    this.$store.commit('removeExercise', data._id);
  }

  @Socket('exerciseSubmission')
  manageExerciseSubmission(data: IExercise) {
    this.$store.commit('manageExerciseSubmission', data);
  }

  @Socket('exerciseSubmission.remove')
  removeExerciseSubmission(data: IExercise) {
    this.$store.commit('removeExerciseSubmission', data._id);
  }
}
