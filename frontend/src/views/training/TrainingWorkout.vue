<template>
  <div class="training-workout">
    <div class="loading-error" content v-if="error">
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

    <div v-else>
      <div class="hero">
        <fh-workout-head :workout="workout" :user="user" />
      </div>
      <div content>
        <fh-exercise-list>
          <fh-exercise-list-item
            v-for="(e, i) in exercises"
            :key="e._id + i"
            :exercise="e"
            :to="{ name: 'training-exercise', params: { id: e._id } }"
          >
            <tc-select
              v-if="$store.getters.valid"
              :onlyIcon="true"
              variant="filled"
              :tfbackground="
                $store.getters.darkmode ? 'containerDark' : 'container'
              "
              :dark="$store.getters.darkmode"
              @selectedItems="s => action(e, s)"
            >
              <tc-select-item icon="list" title="Liste" />
              <tc-select-item icon="plus" title="Workout" />
            </tc-select>
          </fh-exercise-list-item>
        </fh-exercise-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHExercise from '@/components/exercise/FH-Exercise.vue';
import FHExerciseList from '@/components/shared/exercise-list/FH-ExerciseList.vue';
import FHExerciseListItem from '@/components/shared/exercise-list/FH-ExerciseListItem.vue';
import FHButton from '@/components/shared/FH-Button.vue';
import FHWorkoutHead from '@/components/workout/common/FH-Workout-Head.vue';
import FHWorkoutThumbnail from '@/components/workout/thumbnail/FH-Workout-Thumbnail.vue';
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';
import { formatTimeForMessage, getWorkout } from '@/utils/functions';
import { IExerciseInfo, IUserInfo, IWorkout } from '@/utils/interfaces';
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component({
  components: {
    'fh-exercise': FHExercise,
    'fh-workout-thumbnail': FHWorkoutThumbnail,
    'fh-button': FHButton,
    'fh-exercise-list': FHExerciseList,
    'fh-exercise-list-item': FHExerciseListItem,
    'fh-workout-head': FHWorkoutHead
  }
})
export default class TrainingWorkout extends Vue {
  @Prop() workoutId!: string;

  public error = false;
  public workout: IWorkout | null = null;
  public user: IUserInfo | null = null;
  public updated: string | null = null;

  mounted() {
    this.loadData();
  }

  @Watch('$route.params.id')
  public loadData(): void {
    if (!this.workout || this.workout._id !== this.$route.params.id) {
      this.error = false;
      getWorkout(
        this.workoutId || this.$route.params.id,
        (workout: IWorkout | null) => {
          this.error = !workout;
          this.workout = workout;
          if (this.workout) {
            this.updated = formatTimeForMessage(this.workout.updated);
            axios
              .get('user/' + this.workout.author)
              .then(res => (this.user = res.data));
          }
        }
      );
    }
  }

  get exercises(): IExerciseInfo[] {
    if (!this.workout) return [];
    return this.workout.exercises;
  }

  public action(e: IExerciseInfo, actions: string[]) {
    if (actions.length === 0) return;
    if (actions[0] === 'Liste') {
      EventBus.$emit('modal-exercise-list', e);
    } else if (actions[0] === 'Workout') {
      EventBus.$emit('modal-add-to-workout', e);
    }
  }
}
</script>

<style lang="scss" scoped>
.training-workout {
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

  .hero {
    margin-top: calc(-200px - env(safe-area-inset-top));
    /deep/ .tl-grid {
      padding-top: calc(50px + 2 * env(safe-area-inset-top));
    }
  }
  .fh-exercise-list {
    margin-top: 20px;
  }
}
</style>
