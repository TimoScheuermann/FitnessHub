<template>
  <tc-modal
    class="fh-edit-trainingplan"
    v-model="modalOpened"
    title="Traingsplan bearbeiten"
    :subtitle="day"
    :dark="$store.getters.darkmode"
  >
    <div class="current" v-if="trainingplan">
      <template v-if="trainingplan.id.startsWith('ex_')">
        <div class="title">Aktuelle Übung</div>
        <div class="exercise" @click.capture.stop="">
          <fh-exercise :exercise="trainingplan.exercises[0]"></fh-exercise>
        </div>
      </template>
      <template v-else>
        <div class="title">Aktuelles Workout</div>
        <fh-workout-list :showOnly="trainingplan.id" />
      </template>
    </div>
    <h1>Traingseinheit</h1>
    <h2>Übung suchen</h2>
    <fh-exercise-search :timestamp="index" @exercise="useExercise" />
    <h2>Workouts</h2>
    <template v-if="$store.getters.workouts.length > 0">
      <fh-workout-list @workout="useWorkout" />
      <br />
      <tl-grid>
        <tc-button
          :disabled="$store.getters.loading"
          variant="filled"
          tfbackground="success"
          name="Neues Workout erstellen"
          icon="gym"
          @click="createWorkout"
        />
      </tl-grid>
    </template>
    <template v-else>
      <p>Du hast noch kein Workout erstellt...</p>
      <tl-grid>
        <tc-button
          :disabled="$store.getters.loading"
          variant="filled"
          tfbackground="success"
          name="Workout erstellen"
          icon="gym"
          @click="createWorkout"
        />
      </tl-grid>
    </template>
  </tc-modal>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { days } from '@/utils/constants';
import { EventBus } from '@/utils/eventbus';
import { IExercise, ITrainingplanFull, IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHExerciseSearch from '../exercise/FH-ExerciseSearch.vue';
import FHExercise from '@/components/exercise/FH-Exercise.vue';
import FHWorkoutList from './FH-WorkoutList.vue';

@Component({
  components: {
    'fh-workout-list': FHWorkoutList,
    'fh-exercise': FHExercise,
    'fh-exercise-search': FHExerciseSearch
  }
})
export default class FHEditTrainingplan extends Vue {
  public modalOpened = false;
  public day = 'Montag';
  public index = 1;

  mounted() {
    EventBus.$on('edit-trainingplan', (day: number) => {
      this.day = days[day];
      this.index = day;
      this.modalOpened = true;
    });
  }

  get trainingplan(): ITrainingplanFull | null {
    const plan = this.$store.getters.trainingplan;
    if (!plan) return null;
    if (Object.keys(plan).includes('' + this.index)) {
      return this.$store.getters.trainingplan['' + this.index];
    }
    return null;
  }

  public createWorkout() {
    EventBus.$emit('modal-create-workout');
    EventBus.$emit('modal-create-workout-return', {
      event: 'edit-trainingplan',
      data: this.index
    });
    this.modalOpened = false;
  }

  public useExercise(exercise: IExercise) {
    this.set('ex_' + exercise._id);
  }

  public useWorkout(workout: IWorkout) {
    this.set(workout._id);
  }

  private set(id: string) {
    if (!this.$store.getters.loading) {
      axios.put('trainingplan/' + this.index + '/' + id).then(res => {
        this.modalOpened = false;
        this.$store.commit('setTrainingplan', res.data);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-edit-trainingplan {
  .current {
    .title {
      font-weight: 500;
      margin-bottom: 10px;
      font-size: 1.3em;
    }
    .exercise /deep/ .tc-button {
      display: none;
    }
  }
}
</style>
