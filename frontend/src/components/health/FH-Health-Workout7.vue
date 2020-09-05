<template>
  <div class="fh-health-card fh-health-workout7">
    <fh-health-head average="Workouts" amount="5" unitShort=" von 7 Tagen" />
    <tc-divider :dark="$store.getters.darkmode" />
    <div class="workout-days">
      <div class="day" v-for="d in days" :key="d.getTime()">
        <div class="name">{{ dayNames[d.getDay()].substring(0, 2) }}</div>
        <div
          class="circle"
          :class="{ workedout: d.getDay() !== 2 && d.getDay() !== 6 }"
        >
          {{ d.getDate() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { aDay, days } from '@/utils/constants';
import { Vue, Component } from 'vue-property-decorator';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead
  }
})
export default class FHHealthWorkout7 extends Vue {
  public dayNames = days;

  get days(): Date[] {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(this.roundDate(new Date().getTime() - aDay * i));
    }
    return days;
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
        background: $container_dark;
        font-size: 12px;
        font-weight: bold;

        &.workedout {
          background: $success;
          color: #fff;
        }
      }
      &:nth-child(3) {
        .circle:not(.workedout) {
          box-sizing: border-box;
          border: 3px solid rgba(#fff, 0.1);
        }
      }
    }
  }
}
</style>
