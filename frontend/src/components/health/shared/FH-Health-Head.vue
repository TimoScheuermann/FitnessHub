<template>
  <div class="fh-health-card--head">
    <div class="container">
      <div class="unit_long">
        <span v-if="timespan === 0">{{ unitLong }}</span>
        <span v-else>{{ average }}</span>
      </div>
      <div class="currently">
        <span class="amount">{{ amount }}</span>
        <span class="unit_short">{{ unitShort }}</span>
      </div>
      <div class="timespan" v-if="showSpan">{{ timespanText }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { aDay, aWeek, aYear, days, months } from '@/utils/constants';
import { formatTimeForMessage } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class FHHealthHead extends Vue {
  @Prop({ default: 'Liter' }) unitLong!: string;
  @Prop({ default: 'l' }) unitShort!: string;
  @Prop({ default: 20 }) amount!: number;
  @Prop({ default: 1 }) timespan!: number;
  @Prop({ default: 'durchschnitt' }) average!: string;
  @Prop({ default: false }) showSpan!: boolean;

  public multis = [aDay, aWeek, 4 * aWeek, aYear];

  get timespanText(): string {
    const date: Date = new Date();
    const now = `${days[date.getDay()].substring(0, 2)}, ${date.getDate()}. ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
    if (this.timespan === 0) {
      return now;
    }
    return `${formatTimeForMessage(
      date.getTime() - this.multis[this.timespan]
    )} - ${now}`;
  }
}
</script>

<style lang="scss" scoped>
.fh-health-card--head .container {
  .unit_long {
    text-transform: uppercase;
    font-weight: 600;
    opacity: 0.5;
  }
  .currently {
    font-weight: bold;
    .amount {
      font-size: 2em;
    }
    .unit_short {
      font-size: 20px;
      opacity: 0.5;
      margin-left: 3px;
    }
  }
  .timespan {
    font-weight: 600;
    opacity: 0.75;
    font-size: 14px;
  }
}
</style>
