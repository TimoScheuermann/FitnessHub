<template>
  <div class="training" content>
    <fh-todays-workout />
    <template v-if="trendingExercises && trendingExercises.length > 0">
      <h1>Übungen der Woche</h1>
      <fh-carousel>
        <fh-exercise
          v-for="e in trendingExercises"
          :key="e._id"
          :exercise="e"
        />
      </fh-carousel>
    </template>

    <template v-if="latestExercises && latestExercises.length > 0">
      <h1>Neueste Übungen</h1>
      <fh-carousel>
        <fh-exercise v-for="e in latestExercises" :key="e._id" :exercise="e" />
      </fh-carousel>
    </template>

    <template v-if="latestWorkouts && latestWorkouts.length > 0">
      <h1>Aktuelle Workouts</h1>
      <fh-carousel>
        <router-link
          v-for="w in latestWorkouts"
          :key="w._id"
          :to="{ name: 'training-workout', params: { id: w._id } }"
        >
          <fh-workout-preview :workout="w" />
        </router-link>
      </fh-carousel>
    </template>

    <h1>Betroffene Muskeln</h1>
    <fh-carousel>
      <div v-for="(pairs, i) in musclePairs" :key="i + 'mp'">
        <tc-list :dark="$store.getters.darkmode">
          <tc-list-item
            v-for="m in pairs"
            :key="m"
            :title="m"
            :to="{ name: 'training-muscle', params: { muscle: m } }"
          />
        </tc-list>
      </div>
    </fh-carousel>
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

@Component({
  components: {
    'fh-exercise': FHExercise,
    'fh-workout-preview': FHWorkoutPreview,
    'fh-todays-workout': FHTodaysWorkout
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

  get musclePairs(): string[][] {
    const newArr = [];
    while (this.muscles.length) newArr.push(this.muscles.splice(0, 3));
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
