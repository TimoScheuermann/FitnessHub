<template>
  <div class="fh-workout-form">
    <FHErrorList :id="errorKey" />

    <tc-input
      type="title"
      v-model="dto.title"
      title="Name des Workouts"
      :dark="true"
      :frosted="true"
    />
    <form @submit.prevent="submit">
      <tc-input
        pattern=".{2,}"
        v-model="query"
        icon="lens"
        :frosted="true"
        :dark="true"
        placeholder="Übung suchen"
        @input="submit"
      />
    </form>

    <p
      center
      v-if="
        (!results || results.length === 0) && selectedExercises.length === 0
      "
    >
      Suche nach Übungen, um diese zu deinem Workout hinzuzufügen
    </p>
    <template v-else>
      <br />
      <tl-grid>
        <FHList>
          <FHListItem
            v-for="r in results || []"
            :key="'r' + r._id"
            :avatar="r.thumbnail"
            :title="r.title"
          >
            <tc-button icon="plus" tfbackground="success" @click="add(r)" />
          </FHListItem>
        </FHList>
        <FHList>
          <FHListItem
            v-for="(s, i) in selectedExercises"
            :key="'s' + i + s._id"
            :avatar="s.thumbnail"
            :title="s.title"
          >
            <tc-button icon="minus" tfbackground="error" @click="remove(i)" />
          </FHListItem>
        </FHList>
      </tl-grid>
    </template>

    <br />
    <tl-flow>
      <tc-button
        v-if="!workout"
        :disabled="isSubmitting"
        name="Workout erstellen"
        tfbackground="success"
        variant="filled"
        @click="createWorkout"
      />

      <tc-button
        v-if="workout"
        :disabled="isSubmitting"
        name="Workout ändern"
        tfbackground="alarm"
        variant="filled"
        @click="updateWorkout"
      />
    </tl-flow>
  </div>
</template>

<script lang="ts">
import backend from '@/utils/backend';
import { CreateWorkoutDTO } from '@/utils/dtos';
import { FHEventBus } from '@/utils/FHEventbus';
import { closeFullscreen } from '@/utils/functions';
import { IExercise, IExerciseInfo, IWorkout } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import FHErrorList from '../FHErrorList.vue';
import FHList from '../list/FHList.vue';
import FHListItem from '../list/FHListItem.vue';

@Component({
  components: {
    FHList,
    FHListItem,
    FHErrorList
  }
})
export default class FHWorkoutForm extends Vue {
  @Prop() workout!: IWorkout;

  public errorKey = 'workout-form';
  public dto: CreateWorkoutDTO = { title: '', exercises: [] };
  public query = '';
  public selectedExercises: (IExercise | IExerciseInfo)[] = [];
  public results: IExercise[] | null = null;
  public isSubmitting = false;

  mounted() {
    if (this.workout) {
      this.workoutChanged();
    }
  }

  @Watch('workout', { deep: true, immediate: true })
  public workoutChanged(): void {
    if (this.workout) {
      this.selectedExercises = this.workout.exercises;
      this.dto.title = this.workout.title;
    }
  }

  public async submit(): Promise<void> {
    if (this.query.length < 2) return;
    const { data } = await backend.get(
      'exercise/find/' + encodeURI(this.query)
    );
    this.results = data;
  }

  public add(ex: IExercise) {
    if (!ex) return;
    this.selectedExercises.push(ex);
  }

  public remove(index: number) {
    this.selectedExercises.splice(index, 1);
  }

  public prepareDTO(): void {
    this.dto.exercises = this.selectedExercises.map(x => x._id);
  }

  public async createWorkout(): Promise<void> {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.prepareDTO();
    backend
      .post('workout', this.dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  public async updateWorkout(): Promise<void> {
    if (this.isSubmitting || !this.workout) return;
    this.isSubmitting = true;
    this.prepareDTO();

    backend
      .put('workout/' + this.workout._id, this.dto)
      .then(this.handleResponse)
      .catch(this.handleCatch);
  }

  private handleResponse(res: { data: IWorkout }): void {
    UserManagement.addWorkout(res.data);
    closeFullscreen('workouts');
  }

  private handleCatch(err: { statusCode: number; message: string }): void {
    const { statusCode, message } = err;
    if (statusCode && statusCode === 422 && message) {
      FHEventBus.$emit('fh-error-list-' + this.errorKey, message);
    }
    this.isSubmitting = false;
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-form {
  form,
  .tc-input {
    margin-left: auto !important;
    margin-right: auto !important;
    max-width: 400px;
    margin-top: 20px;

    .tc-input {
      padding: 10px 20px;
    }
  }

  .fh-list {
    max-height: 400px;
    overflow-y: auto;
    border-radius: 25px;
    z-index: 10;

    @include custom-scrollbar__dark();

    .fh-list-item {
      background: rgba($color, 0.8);
      color: #fff;
      .tc-button {
        border-radius: 50px;
        margin-right: -5px;
      }
    }
  }
}
</style>
