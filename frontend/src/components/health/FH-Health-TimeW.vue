<template>
  <div
    class="fh-health-card fh-health-time-w"
    v-if="average.hours + average.minutes > 0"
  >
    <fh-health-head average="Trainingszeit" :description="description" />
    <div class="time-container">
      <div class="average-text" :style="averageStyle">Durchschnitt</div>
      <div class="average-bar" :style="averageStyle" />
      <div class="average-time" :style="averageStyle">
        {{ average.hours }}<span>h</span> {{ average.minutes }}<span>m</span>
      </div>
      <div class="bar-wrapper">
        <div
          class="bar"
          v-for="(t, i) in times"
          :key="i"
          :style="getStyle(i)"
        />
        <div class="day" v-for="(d, i) in days" :key="d + i">{{ d }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { days } from '@/utils/constants';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead
  }
})
export default class FHHealthTimeW extends Vue {
  @Prop() chartData!: number[][];

  public height = 125;

  get chart(): number[][] {
    return this.chartData || this.$store.getters.chartWorkouts;
  }

  get times(): number[] {
    return this.chart
      .filter((x, i) => i > 20)
      .map(x => Math.floor(x.reduce((a, b) => a + b, 0) / 60));
  }

  get days(): string[] {
    return [...days, ...days]
      .filter((x, i) => i > new Date().getDay())
      .filter((x, i) => i < 7)
      .map(x => x.substring(0, 1));
  }

  get description(): string {
    if (this.chartData)
      return `Durschnittliche Trainingszeiten der letzten 7 Tage: ${this.average.hours}h ${this.average.minutes}m`;
    return `In den letzten 7 Tagen hast du im Schnitt ${this.average.hours}h ${this.average.minutes}m trainiert.`;
  }

  get average(): { minutes: number; hours: number } {
    const mins = Math.round(this.times.reduce((a, b) => a + b, 0) / 7);
    return {
      hours: Math.floor(mins / 60),
      minutes: mins % 60
    };
  }

  getStyle(index: number): Record<string, unknown> {
    return {
      height: (this.times[index] / Math.max(...this.times)) * this.height + 'px'
    };
  }

  get averageStyle(): Record<string, unknown> {
    return {
      bottom:
        (this.times.reduce((a, b) => a + b, 0) / 7 / Math.max(...this.times)) *
          this.height +
        'px'
    };
  }
}
</script>

<style lang="scss" scoped>
.fh-health-time-w {
  .time-container {
    display: flex;
    position: relative;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 27.5px;

    .average-bar,
    .average-time,
    .average-text {
      left: 0;
      right: 0;
      position: absolute;
      transform: translateY(50%);
    }
    .average-bar {
      background: $success;
      height: 5px;
      border-radius: $border-radius;
      margin-bottom: 17.5px;
    }
    .average-time {
      margin-bottom: -2.5px;
      font-size: 1.5em;
      font-weight: bold;
      span {
        font-weight: normal;
        font-size: 16px;
      }
    }
    .average-text {
      margin-bottom: 32.5px;
      opacity: 0.5;
    }
    .bar-wrapper {
      display: grid;
      grid-template-columns: repeat(7, 12.5px);
      grid-gap: 5px 15px;
      grid-template-rows: 1fr 12.5px;
      .bar {
        display: flex;
        align-self: baseline;
        border-radius: $border-radius;

        background: $container;
        @media (prefers-color-scheme: dark) {
          background: $container_dark;
        }
      }
      .day {
        opacity: 0.75;
      }
    }
  }
}
</style>
