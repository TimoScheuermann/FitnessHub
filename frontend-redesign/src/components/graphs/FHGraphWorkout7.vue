<template>
  <div class="fh-graph-card fh-graph-workout7">
    <FHGraphHead average="Workouts" :amount="total" unitShort=" von 7 Tagen" />
    <tc-divider :dark="$store.getters.darkmode" />
    <div class="workout-days">
      <div class="day" v-for="(d, i) in days" :key="d.getTime()">
        <div class="name">{{ dayName(d) }}</div>
        <div class="circle" :class="{ workedout: hasWorkedout(i) }">
          {{ d.getDate() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { aDay, days } from '@/utils/constants';
import { TrainingStatistics } from '@/utils/Trainingstatistics';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHGraphHead from './FHGraphHead.vue';

@Component({
  components: {
    FHGraphHead
  }
})
export default class FHGraphWorkout7 extends Vue {
  @Prop() chartData!: number[][];

  get chart(): number[][] {
    return this.chartData || TrainingStatistics.getChartData();
  }

  get days(): Date[] {
    const today = new Date().getTime();
    return Array.from(
      { length: 7 },
      (_x, i) => new Date(today - aDay * (6 - i))
    );
  }

  get total(): number {
    return this.chart.filter((x, i) => i > 20 && x.length > 0).length;
  }

  public hasWorkedout(index: number): boolean {
    return this.chart[index + 21].length > 0;
  }

  public dayName(date: Date) {
    return days[date.getDay()].substring(0, 2);
  }
}
</script>

<style lang="scss" scoped>
.fh-graph-workout7 {
  .workout-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      .name {
        margin-bottom: 10px;
        opacity: 0.75;
      }
      .circle {
        $scale: 30px;
        height: $scale;
        width: $scale;
        border-radius: $scale;
        display: grid;
        place-content: center;
        background: $container;
        @media (prefers-color-scheme: dark) {
          background: $container_dark;
        }
        font-size: 12px;
        font-weight: bold;

        &.workedout {
          background: $success;
          color: #fff;
        }
      }
      &:last-child {
        .circle:not(.workedout) {
          box-sizing: border-box;
          border: 3px solid rgba($color, 0.1);
          @media (prefers-color-scheme: dark) {
            border-color: rgba($color_dark, 0.1);
          }
        }
      }
    }
  }
}
</style>
