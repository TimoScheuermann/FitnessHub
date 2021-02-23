<template>
  <div class="view-trainingstatistics" content>
    <div max-width>
      <h3>Gesundheit</h3>
      <tl-grid>
        <div>
          <FHGraphWater />
        </div>
        <div>
          <FHGraphBMI />
        </div>
        <div>
          <FHGraphWeight />
        </div>
      </tl-grid>
      <h3>Wöchentlich</h3>
      <tl-grid>
        <FHGraphTimeW />
        <FHGraphTime-c />
        <FHGraphWorkout7 />
        <FHGraphWorkoutW />
      </tl-grid>
      <h3>Monatlich</h3>
      <FHGraphWorkout28 />
    </div>
  </div>
</template>

<script lang="ts">
import FHGraphBMI from '@/components/graphs/FHGraphBMI.vue';
import FHGraphTimeC from '@/components/graphs/FHGraphTimeC.vue';
import FHGraphTimeW from '@/components/graphs/FHGraphTimeW.vue';
import FHGraphWater from '@/components/graphs/FHGraphWater.vue';
import FHGraphWeight from '@/components/graphs/FHGraphWeight.vue';
import FHGraphWorkout28 from '@/components/graphs/FHGraphWorkout28.vue';
import FHGraphWorkout7 from '@/components/graphs/FHGraphWorkout7.vue';
import FHGraphWorkoutW from '@/components/graphs/FHGraphWorkoutW.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHGraphWeight,
    FHGraphBMI,
    FHGraphWater,
    FHGraphWorkout7,
    FHGraphWorkout28,
    FHGraphWorkoutW,
    FHGraphTimeW,
    FHGraphTimeC
  }
})
export default class Trainingstatistics extends Vue {}
</script>

<style lang="scss" scoped></style>
