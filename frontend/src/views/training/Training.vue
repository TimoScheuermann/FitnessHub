<template>
  <div class="training" content>
    <tl-grid buttons minWidth="50">
      <fh-button icon="lens" title="Übung" />
      <fh-button routeName="training-wiki" icon="books" title="Muskelguide" />
    </tl-grid>
    <fh-todays-workout />

    <template v-if="muscleTriplets && muscleTriplets.length > 0">
      <h2>Muskel</h2>
      <div class="muscles-overview">
        <div
          class="muscle-row"
          v-for="(tri, i) in muscleTriplets"
          :key="i + 'm'"
        >
          <router-link
            class="muscle"
            v-for="m in tri"
            :key="m"
            :to="{ name: 'training-muscle', params: { muscle: m } }"
          >
            <div class="name">{{ m }}</div>
            <div class="icon">
              <i class="ti-chevron-right" />
            </div>
          </router-link>
        </div>
      </div>
    </template>

    <template v-if="trendingExercises && trendingExercises.length > 0">
      <h2>Beliebte Übungen</h2>
      <fh-carousel>
        <fh-exercise-two
          v-for="e in trendingExercises"
          :key="e._id"
          :exercise="e"
        />
      </fh-carousel>
    </template>

    <template v-if="latestExercises && latestExercises.length > 0">
      <h2>Neueste Übungen</h2>
      <fh-carousel>
        <fh-exercise-two
          v-for="e in latestExercises"
          :key="e._id"
          :exercise="e"
        />
      </fh-carousel>
    </template>

    <template v-if="latestWorkouts && latestWorkouts.length > 0">
      <h2>Aktuelle Workouts</h2>
      <fh-carousel>
        <fh-workout-preview
          v-for="w in latestWorkouts"
          :key="w._id"
          :workout="w"
        />
      </fh-carousel>
    </template>
  </div>
</template>

<script lang="ts">
import { IExercise, IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import axios from '@/utils/axios';
import FHWorkoutPreview from '@/components/workout/FH-WorkoutPreview.vue';
import FHTodaysWorkout from '@/components/workout/FH-TodaysWorkout.vue';
import FHExercise from '@/components/exercise/FH-Exercise.vue';
import { getMuscleNames } from '@/utils/functions';
import FHExerciseTwo from '@/components/exercise/FH-Exercise-Two.vue';
import FHButton from '@/components/shared/FH-Button.vue';

@Component({
  components: {
    'fh-exercise': FHExercise,
    'fh-workout-preview': FHWorkoutPreview,
    'fh-todays-workout': FHTodaysWorkout,
    'fh-exercise-two': FHExerciseTwo,
    'fh-button': FHButton
  }
})
export default class Training extends Vue {
  public muscles = getMuscleNames();

  get trendingExercises(): IExercise[] | null {
    return this.$store.state.trendingExercises;
  }
  get latestExercises(): IExercise[] | null {
    return this.$store.state.latestExercises;
  }

  get latestWorkouts(): IWorkout[] | null {
    return this.$store.state.latestWorkouts;
  }

  get muscleTriplets(): string[][] {
    const muscles = getMuscleNames();
    const max = Math.ceil(muscles.length / 3);
    const newArr = [];
    while (muscles.length) newArr.push(muscles.splice(0, max));
    return newArr;
  }

  mounted() {
    if (!this.trendingExercises) {
      axios.get('exercise/trending').then(res => {
        this.$store.commit('setTrendingExercise', res.data);
      });
    }
    if (!this.latestExercises) {
      axios.get('exercise/latest').then(res => {
        this.$store.commit('setLatestExercise', res.data);
      });
    }
    if (!this.latestWorkouts) {
      axios.get('workout/latest').then(res => {
        this.$store.commit('setLatestWorkouts', res.data);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.training {
  .tl-grid[buttons] {
    margin-top: 20px;
    .fh-button {
      background: $paragraph;
      box-shadow: $shadow-light;
      @media (prefers-color-scheme: dark) {
        background: $paragraph_dark;
      }
    }
  }
  .muscles-overview {
    overflow-y: auto;

    .muscle-row {
      display: flex;
      flex-wrap: nowrap;
      margin: 0 -5px;
      .muscle {
        color: inherit;
        cursor: pointer;
        display: flex;
        flex-wrap: nowrap;
        padding: 5px 7.5px;
        background: $container;
        border-radius: $border-radius;
        margin: 5px;
        opacity: 0.8;
        transition: 0.2s ease-in-out;
        &:hover {
          opacity: 1;
        }
        .name {
          white-space: nowrap;
        }
        .icon {
          margin-left: 5px;
          i {
            font-size: 11px;
            opacity: 0.75;
          }
        }
      }
    }

    @include custom-scrollbar__light();
    @media (prefers-color-scheme: dark) {
      @include custom-scrollbar__dark();
      .muscle-row .muscle {
        background: $container_dark;
      }
    }
  }
}
</style>
