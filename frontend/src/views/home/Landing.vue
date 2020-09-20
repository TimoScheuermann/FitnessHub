<template>
  <div class="landing" content>
    <tc-segments :dark="$store.getters.darkmode">
      <tc-segment-item title="Timer">
        <fh-timer />
      </tc-segment-item>
      <tc-segment-item title="Stoppuhr">
        <fh-stopwatch />
      </tc-segment-item>
    </tc-segments>
    <h1>Workout</h1>
    <tl-grid minWidth="100">
      <fh-category-preview
        :category="{
          title: 'Training starten',
          thumbnail:
            'https://assets.mixkit.co/videos/preview/mixkit-runner-does-stretch-routine-with-city-bridge-in-background-15801-small.mp4'
        }"
        routeName="training"
      />
      <fh-category-preview
        @click="createWorkout"
        :noLink="true"
        :category="{
          title: 'Workout erstellen',
          thumbnail:
            'https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-ropes-in-the-gym-23141-small.mp4'
        }"
      />
    </tl-grid>
  </div>
</template>

<script lang="ts">
import FHStopwatch from '@/components/home/FH-Stopwatch.vue';
import FHTimer from '@/components/home/FH-Timer.vue';
import FHCategoryPreview from '@/components/recipe/FH-CategoryPreview.vue';
import { EventBus } from '@/utils/eventbus';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-timer': FHTimer,
    'fh-stopwatch': FHStopwatch,
    'fh-category-preview': FHCategoryPreview
  }
})
export default class Landing extends Vue {
  public createWorkout() {
    EventBus.$emit('modal-create-workout');
  }
}
</script>

<style lang="scss" scoped>
[content] {
  padding-top: 20px;
}
</style>
