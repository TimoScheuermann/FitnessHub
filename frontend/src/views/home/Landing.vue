<template>
  <div class="landing" content>
    <tl-flow>
      <tc-segments :dark="$store.getters.darkmode">
        <tc-segment-item title="Timer">
          <fh-timer />
        </tc-segment-item>
        <tc-segment-item title="Stoppuhr">
          <fh-stopwatch />
        </tc-segment-item>
      </tc-segments>
    </tl-flow>
    <h1>Workout</h1>
    <tl-grid minWidth="100">
      <fh-preview
        title="Training starten"
        thumbnail="https://assets.mixkit.co/videos/preview/mixkit-runner-does-stretch-routine-with-city-bridge-in-background-15801-small.mp4"
        routeName="training"
        subtitle="Starte ein beliebiges Training, um dein Ziel zu erreichen"
      />
      <fh-preview
        @click="createWorkout"
        title="Workout erstellen"
        thumbnail="https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-ropes-in-the-gym-23141-small.mp4"
        subtitle="Erstelle eine Abfolge von Übungen, die du regelmäßig ausüben möchtest"
      />
    </tl-grid>
  </div>
</template>

<script lang="ts">
import FHPreview from '@/components/common/FH-Preview.vue';
import FHStopwatch from '@/components/home/FH-Stopwatch.vue';
import FHTimer from '@/components/home/FH-Timer.vue';
import { EventBus } from '@/utils/eventbus';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-timer': FHTimer,
    'fh-stopwatch': FHStopwatch,
    'fh-preview': FHPreview
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
