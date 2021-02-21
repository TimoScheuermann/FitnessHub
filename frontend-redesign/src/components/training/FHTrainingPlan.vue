<template>
  <div class="fh-training-plan" max-width>
    <br />
    <FHHeading title="Trainingsplan" subtitle="Dein persönlicher" />
    <div class="day-tiles">
      <div
        class="day-tile"
        transition
        cursor
        v-for="(i, index) in days"
        :key="'tpday-' + i"
        :selected="i === selected"
        @click="selected = i"
      >
        <div class="day-name">{{ dayNames[i].substring(0, 2) }}</div>
        <div class="day-date">{{ getDateInXDays(index) }}</div>
        <i class="ti-dot" v-if="i % 3 === 0" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { aDay, days } from '@/utils/constants';
import { Vue, Component } from 'vue-property-decorator';
import FHHeading from '../FHHeading.vue';

@Component({
  components: {
    FHHeading
  }
})
export default class FHTrainingPlan extends Vue {
  public dayNames = days;
  public selected = new Date().getDay();

  get days(): number[] {
    const today = new Date().getDay();
    const days: number[] = [];
    for (let i = 0; i < 7; i++) {
      days.push((today + i) % 7);
    }
    return days;
  }

  getDateInXDays(days: number): number {
    return new Date(new Date().getTime() + days * aDay).getDate();
  }
}
</script>

<style lang="scss" scoped>
.fh-training-plan {
  .day-tiles {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 10px;
    .day-tile {
      text-align: center;
      border-radius: $border-radius;
      &:hover,
      &:active,
      &[selected] {
        background: $paragraph_dark;
        color: $color_dark;
        @media #{$isDark} {
          background: $paragraph;
          color: $color;
        }
      }
      .day-name {
        font-size: 14px;
        font-weight: 500;
        opacity: 0.75;
        margin-top: 10px;
      }
      .day-date {
        font-weight: bold;
        font-size: 1.2em;
        margin-top: 7.5px;
      }
      i {
        font-size: 2em;
        color: $success;
      }
    }
  }
}
</style>
