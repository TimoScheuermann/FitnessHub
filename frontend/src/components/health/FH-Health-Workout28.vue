<template>
  <div class="fh-health-card fh-health-workout28">
    <fh-health-head
      average="Workouts"
      amount="27"
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
      <div class="day" v-for="(d, i) in days" :key="d.date.getTime()">
        <template v-if="d.show">
          <div class="name" v-if="d.date.getDate() === 1">
            {{ monthNames[d.date.getMonth()].substring(0, 3) }}
          </div>
          <div
            class="circle"
            :class="{
              workedout:
                $store.getters.chartWorkouts[i - new Date().getDay()] > 0
            }"
          >
            <!-- {{ i - new Date().getDay() }} -->
            {{ d.date.getDate() }}
          </div>
        </template>
        <div v-else />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { aDay, days, months } from '@/utils/constants';
import { Vue, Component } from 'vue-property-decorator';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead
  }
})
export default class FHHealthWorkout28 extends Vue {
  public monthNames = months;

  get dayNames(): string[] {
    const dN = [...days];
    dN.push(dN.shift() as string);
    return dN;
  }

  get days(): { show: boolean; date: Date }[] {
    const days = [];
    for (let i = 0; i < new Date().getDay(); i++) {
      days.push({ show: false, date: new Date(i) });
    }
    for (let i = 0; i < 28; i++) {
      days.push({
        show: true,
        date: this.roundDate(new Date().getTime() - aDay * i)
      });
    }
    return days.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  public roundDate(timeStamp: number | Date): Date {
    if (typeof timeStamp !== 'number')
      timeStamp = new Date(timeStamp).getTime();
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000); //subtract amount of time since midnight
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000; //add on the timezone offset
    return new Date(timeStamp);
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
        .circle {
        }
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
