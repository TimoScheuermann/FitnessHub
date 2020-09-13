<template>
  <div class="highlights" content>
    <h1>Gesundheit</h1>
    <tl-grid>
      <div>
        <fh-health-water />
      </div>
      <div>
        <fh-health-bmi />
      </div>
      <div>
        <fh-health-weight />
      </div>
    </tl-grid>
    <h1>Wöchentlich</h1>
    <tl-grid>
      <fh-health-time-w />
      <fh-health-time-c />
      <fh-health-workout7 />
      <fh-health-workout-w />
    </tl-grid>
    <h1>Monatlich</h1>
    <fh-health-workout28 />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FHHealthWater from '@/components/health/FH-Health-Water.vue';
import FHHealthWorkout7 from '@/components/health/FH-Health-Workout7.vue';
import FHHealthWorkout28 from '@/components/health/FH-Health-Workout28.vue';
import FHHealthWorkoutW from '@/components/health/FH-Health-WorkoutW.vue';
import FHHealthTimeW from '@/components/health/FH-Health-TimeW.vue';
import FHHealthTimeC from '@/components/health/FH-Health-TimeC.vue';
import FHHealthWeight from '@/components/health/FH-Health-Weight.vue';
import FHHealthBMI from '@/components/health/FH-Health-BMI.vue';

@Component({
  components: {
    'fh-health-weight': FHHealthWeight,
    'fh-health-bmi': FHHealthBMI,
    'fh-health-water': FHHealthWater,
    'fh-health-workout7': FHHealthWorkout7,
    'fh-health-workout28': FHHealthWorkout28,
    'fh-health-workout-w': FHHealthWorkoutW,
    'fh-health-time-w': FHHealthTimeW,
    'fh-health-time-c': FHHealthTimeC
  }
})
export default class Highlights extends Vue {}
</script>
