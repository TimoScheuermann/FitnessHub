<template>
  <div class="training" content>
    <template v-if="trending">
      <h1>Übungen der Woche</h1>
      <fh-carousel>
        <fh-exercise v-for="e in trending" :key="e._id" :exercise="e" />
      </fh-carousel>
    </template>

    <tc-link
      :to="{
        name: 'workout-detail',
        params: { id: '5f57ca73a012872d48451f52' }
      }"
      >tmp</tc-link
    >

    <template v-if="latestWorkouts">
      <h1>Aktuelle Workouts</h1>
      <fh-carousel>
        <router-link
          v-for="w in latestWorkouts"
          :key="w._id"
          :to="{ name: 'workout-detail', params: { id: w._id } }"
        >
          <fh-workout-preview :workout="w" />
        </router-link>
      </fh-carousel>
    </template>

    <h1>Betroffene Muskeln</h1>
    <div class="muscles-mobile">
      <tc-list :dark="$store.getters.darkmode">
        <tc-list-item
          v-for="m in muscles"
          :key="m"
          :title="m"
          :to="{ name: 'traning-muscle', params: { muscle: m } }"
        />
      </tc-list>
    </div>
    <div class="muscles-desktop">
      <tl-grid minWidth="200">
        <tc-list v-for="m in muscles" :key="m" :dark="$store.getters.darkmode">
          <tc-list-item
            :title="m"
            :to="{ name: 'training-muscle', params: { muscle: m } }"
          />
        </tc-list>
      </tl-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { IExercise, IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHExercise from '@/components/shared/FH-Exercise.vue';
import axios from '@/utils/axios';
import { muscles } from '@/utils/muscles';
import FHWorkoutPreview from '@/components/workout/FH-WorkoutPreview.vue';

@Component({
  components: {
    'fh-exercise': FHExercise,
    'fh-workout-preview': FHWorkoutPreview
  }
})
export default class Training extends Vue {
  private muscles = muscles;

  get trending(): IExercise[] | null {
    return this.$store.state.trendingExercises;
  }
  get latestWorkouts(): IWorkout[] | null {
    return this.$store.state.latestWorkouts;
  }

  mounted() {
    if (!this.trending) {
      axios.get('exercise/trending').then(res => {
        this.$store.commit('setTrendingExercise', res.data);
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
.cd-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0px;
  border-radius: $border-radius;
  background: $paragraph;
  box-shadow: $shadow;
  overflow: hidden;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
}
.cd-media {
  width: 100%;
  height: 100%;
  color: white;
  position: relative;
  overflow: hidden;
}
.cd-media > img {
  width: 100%;
  height: 80%;
  z-index: 1;
  filter: blur(3px);
  overflow: hidden;
}
.centered {
  z-index: 10;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cd-content {
  margin: 1em;
  text-align: justify;
}
.exercise-carousell {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  margin: 0 -5vw;
  @include custom-scrollbar__light();
  @media (prefers-color-scheme: dark) {
    @include custom-scrollbar__dark();
  }
  .ce {
    flex-shrink: 0;
    width: 5vw;
  }

  .fh-exercise,
  .tc-card {
    width: 250px;
    margin-left: 30px;
    scroll-snap-align: center;
    flex-shrink: 0;
    &:first-child {
      margin-left: 5vw;
    }
  }
}
.muscles-mobile {
  @media only screen and (min-width: 500px) {
    display: none;
  }
}
.muscles-desktop {
  @media only screen and (max-width: 499px) {
    display: none;
  }
}
</style>
