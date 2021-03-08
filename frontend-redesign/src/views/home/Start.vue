<template>
  <div class="view-start" content>
    <div max-width>
      <tl-flow>
        <tc-segments :dark="$store.getters.darkmode">
          <tc-segment-item title="Timer">
            <FHTimer />
          </tc-segment-item>
          <tc-segment-item title="Stoppuhr">
            <FHStopwatch />
          </tc-segment-item>
        </tc-segments>
      </tl-flow>
      <!-- <h1>Workout</h1>
    <tl-grid minWidth="100">
      <FHHomePreview
        title="Training starten"
        thumbnail="https://assets.mixkit.co/videos/preview/mixkit-runner-does-stretch-routine-with-city-bridge-in-background-15801-small.mp4"
        routeName="training"
        subtitle="Starte ein beliebiges Training, um dein Ziel zu erreichen"
      />
      <FHHomePreview
        @click="createWorkout"
        title="Workout erstellen"
        thumbnail="https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-ropes-in-the-gym-23141-small.mp4"
        subtitle="Erstelle eine Abfolge von Übungen, die du regelmäßig ausüben möchtest"
      />
    </tl-grid> -->
    </div>
  </div>
</template>

<script lang="ts">
import FHStopwatch from '@/components/home/FHStopwatch.vue';
import FHTimer from '@/components/home/FHTimer.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHTimer,
    FHStopwatch
  }
})
export default class Start extends Vue {}
</script>

<style lang="scss" scoped></style>
