<template>
  <div class="view-Training" content>
    <div max-width>
      <tl-grid minWidth="150" gap="10">
        <FHButton icon="lens" title="Übung" routeName="search-exercise" />
        <FHButton icon="books" title="Muskelguide" routeName="muscle-guide" />
      </tl-grid>

      <FHTrainingPlan />

      <br />
      <FHAppear>
        <div v-if="trendingExercises && trendingExercises.length > 0">
          <FHHeading title="Übungen" subtitle="Beliebte" />
          <FHCarousel>
            <FHExercisePreview
              v-for="e in trendingExercises"
              :key="e._id"
              :exercise="e"
            />
          </FHCarousel>
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="latestExercises && latestExercises.length > 0">
          <FHHeading title="Übungen" subtitle="Neueste" />
          <FHCarousel>
            <FHExercisePreview
              v-for="e in latestExercises"
              :key="e._id"
              :exercise="e"
            />
          </FHCarousel>
        </div>
      </FHAppear>

      <FHAppear>
        <div v-if="latestWorkouts && latestWorkouts.length > 0">
          <FHHeading title="Workouts" subtitle="Aktuelle" />
          <FHCarousel>
            <FHExercisePreview
              v-for="w in latestWorkouts"
              :key="w._id"
              :exercise="w"
            />
          </FHCarousel>
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHButton from '@/components/FHButton.vue';
import FHTrainingPlan from '@/components/training/FHTrainingPlan.vue';
import { IExercise, IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import FHExercisePreview from '@/components/training/FHExercisePreview.vue';
import FHHeading from '@/components/FHHeading.vue';
import FHCarousel from '@/components/FHCarousel.vue';
import FHAppear from '@/components/FHAppear.vue';

@Component({
  components: {
    FHButton,
    FHTrainingPlan,
    FHExercisePreview,
    FHHeading,
    FHCarousel,
    FHAppear
  }
})
export default class Training extends Vue {
  get trendingExercises(): IExercise[] | null {
    return this.$store.getters.trendingExercises;
  }
  get latestExercises(): IExercise[] | null {
    return this.$store.getters.latestExercises;
  }
  get latestWorkouts(): IWorkout[] | null {
    return this.$store.getters.latestWorkouts;
  }
}
</script>
