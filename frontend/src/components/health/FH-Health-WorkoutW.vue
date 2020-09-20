<template>
  <div
    v-if="lastWeek !== 0 && thisWeek !== 0"
    class="fh-health-card fh-health-workout-w"
    :style="'--perc-min:' + percOfMin"
  >
    <fh-health-head average="Workouts" :description="description" />
    <tc-divider :dark="$store.getters.darkmode" />
    <div class="workout-bar first" :class="{ min: isThisMin }">
      <div class="title">{{ thisWeek }}<span>Workouts</span></div>
      <div class="bar">Diese Woche</div>
    </div>
    <div class="workout-bar" :class="{ min: isLastMin }">
      <div class="title">{{ lastWeek }}<span>Workouts</span></div>
      <div class="bar">Letzte Woche</div>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead
  }
})
export default class FHHealthWorkoutW extends Vue {
  @Prop() chartData!: number[][];

  get chart(): number[][] {
    return this.chartData || store.getters.chartWorkouts;
  }

  get thisWeek(): number {
    return this.getWorkoutAmount(21, 27);
  }
  get lastWeek(): number {
    return this.getWorkoutAmount(14, 20);
  }

  getWorkoutAmount(start: number, end: number): number {
    return this.chart
      .filter((x, i) => i >= start && i <= end)
      .reduce((a, b) => a + b.length, 0);
  }

  get percOfMin(): string {
    return (
      (Math.min(this.thisWeek, this.lastWeek) /
        Math.max(this.thisWeek, this.lastWeek)) *
        100 +
      '%'
    );
  }
  get isThisMin() {
    return this.thisWeek < this.lastWeek;
  }
  get isLastMin() {
    return this.thisWeek > this.lastWeek;
  }

  get description(): string {
    if (this.chartData)
      return 'Vergleich der Trainigseinheiten der letzten 2 Wochen';
    const diff = this.thisWeek - this.lastWeek;
    if (diff < 0)
      return 'Diese Woche hast du weniger Workouts gemacht als letzte Woche. Gib nochmal alles, dann schaffst du es!';
    if (diff > 0)
      return (
        'Starke Leistung ' +
        this.$store.getters.user.givenName +
        '! Du hast in dieser Woche mehr Workouts gemacht als in der letzten Woche.'
      );
    return 'Du hast in dieser Woche genau so viele Workouts gemacht wie in der letzten Woche. Sehr gut!';
  }
}
</script>

<style lang="scss" scoped>
.fh-health-workout-w {
  .workout-bar {
    &:not(.first) {
      margin-top: 10px;
    }
    &.first {
      .bar {
        background: $success;
        color: #fff;
      }
    }
    .title {
      font-size: 1.5em;
      font-weight: bold;
      span {
        font-size: 16px;
        margin-left: 3px;
        opacity: 0.75;
      }
    }
    &.min .bar {
      width: calc(var(--perc-min) - 20px);
    }
    .bar {
      margin-top: 5px;
      font-size: 14px;
      padding: 5px 10px;
      border-radius: $border-radius;

      background: $container;
      @media (prefers-color-scheme: dark) {
        background: $container_dark;
      }
    }
  }
}
</style>
