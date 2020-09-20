<template>
  <div class="fh-health-card fh-health-workout7">
    <fh-health-head
      average="Workouts"
      :amount="total"
      unitShort=" von 7 Tagen"
    />
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead
  }
})
export default class FHHealthWorkout7 extends Vue {
  @Prop() chartData!: number[][];

  get chart(): number[][] {
    return this.chartData || this.$store.getters.chartWorkouts;
  }

  get days(): Date[] {
    const today = new Date().getTime();
    return Array.from(
      { length: 7 },
      (x, i) => new Date(today - aDay * (6 - i))
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
.fh-health-workout7 {
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
          border: 3px solid rgba(#000, 0.1);
          @media (prefers-color-scheme: dark) {
            border-color: rgba(#fff, 0.1);
          }
        }
      }
    }
  }
}
</style>
