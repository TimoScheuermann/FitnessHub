<template>
  <div class="fh-health-card fh-health-workout28">
    <fh-health-head
      average="Workouts"
      :amount="total"
      unitShort=" in den letzten 4 Wochen"
    />
    <tc-divider :dark="$store.getters.darkmode" />
    <div class="workout-days">
      <div class="day" v-for="d in dayNames" :key="d">
        {{ d.substring(0, 2) }}
      </div>
    </div>
    <tc-divider :dark="$store.getters.darkmode" />
    <div class="workout-days">
      <div class="skip" v-for="s in skips" :key="s" />
      <div class="day" v-for="(d, i) in days" :key="d.getTime()">
        <div class="name" v-if="d.getDate() === 1">
          {{ monthNames[d.getMonth()].substring(0, 3) }}
        </div>
        <div class="circle" :class="{ workedout: hasWorkedout(i) }">
          {{ d.getDate() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { aDay, days, months } from '@/utils/constants';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead
  }
})
export default class FHHealthWorkout28 extends Vue {
  @Prop() chartData!: number[][];

  public monthNames = months;
  public skips = Array.from({ length: new Date().getDay() }, (x, i) => 's' + i);

  get chart(): number[][] {
    return this.chartData || this.$store.getters.chartWorkouts;
  }

  get dayNames(): string[] {
    const dN = [...days];
    dN.push(dN.shift() as string);
    return dN;
  }

  get days(): Date[] {
    const today = new Date().getTime();
    return Array.from(
      { length: 28 },
      (x, i) => new Date(today - aDay * (27 - i))
    );
  }

  public hasWorkedout(index: number) {
    return this.chart[index].length > 0;
  }

  get total(): number {
    return this.chart.filter(x => x.length > 0).length;
  }
}
</script>

<style lang="scss" scoped>
.fh-health-workout28 {
  .workout-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 10px;
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .name {
        position: absolute;
        opacity: 0.75;
        top: -7px;
        font-size: 12px;
      }
      .circle {
        margin-top: 10px;
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
