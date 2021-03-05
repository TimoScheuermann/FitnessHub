<template>
  <div class="fh-training-plan" v-if="$store.getters.valid" max-width>
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
        <i class="ti-dot" v-if="hasExercises(i)" />
      </div>
    </div>

    <div class="day-wrapper">
      <transition name="fade">
        <FHTrainingplanDay :key="selected" :daynumber="selected" />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { aDay, days } from '@/utils/constants';
import { Vue, Component } from 'vue-property-decorator';
import FHAppear from '../FHAppear.vue';
import FHTrainingplanDay from './FHTrainingplanDay.vue';
import FHHeading from '../FHHeading.vue';
import { UserManagement } from '@/utils/UserManagement';

@Component({
  components: {
    FHHeading,
    FHAppear,
    FHTrainingplanDay
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

  public hasExercises(day: number): boolean {
    const plan = UserManagement.getTrainingplan();
    if (!plan) return false;
    for (const [key, value] of Object.entries(plan)) {
      if (new String(day) == key) {
        if (value.exercises.length > 0) return true;
      }
    }
    return false;
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

  .day-wrapper {
    margin-top: 10px;
    margin-bottom: -20px;
    position: relative;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-leave-active {
  // z-index: -1;
  position: absolute;
}
.fade-enter {
  opacity: 0;
  transform: translateX(-20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
