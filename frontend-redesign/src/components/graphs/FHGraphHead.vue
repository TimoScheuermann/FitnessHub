<template>
  <div class="fh-graph-card--head">
    <FHHeading
      :title="description || amount + ' ' + unitShort"
      :subtitle="timespan === 0 ? unitLong : average"
    />
    <div class="timespan" v-if="showSpan">{{ timespanText }}</div>
  </div>
</template>

<script lang="ts">
import { aDay, aWeek, aYear, days, months } from '@/utils/constants';
import { formatTimeForMessage } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHHeading from '../FHHeading.vue';

@Component({
  components: {
    FHHeading
  }
})
export default class FHGraphHead extends Vue {
  @Prop({ default: 'Liter' }) unitLong!: string;
  @Prop({ default: 'l' }) unitShort!: string;
  @Prop({ default: 20 }) amount!: number;
  @Prop({ default: 1 }) timespan!: number;
  @Prop({ default: 'durchschnitt' }) average!: string;
  @Prop({ default: false }) showSpan!: boolean;
  @Prop({ required: false }) description!: string;

  public multis = [aDay, aWeek, 4 * aWeek, aYear];

  // transforms seconds or timestamp to Date
  get timespanText(): string {
    const date: Date = new Date();
    const wday = days[date.getDay()].substring(0, 2);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const now = `${wday}, ${day}. ${month} ${year}`;
    if (this.timespan === 0) {
      return now;
    }
    const span = formatTimeForMessage(
      date.getTime() - this.multis[this.timespan]
    );

    return `${span} - ${now}`;
  }
}
</script>

<style lang="scss" scoped>
.fh-graph-card--head {
  .timespan {
    font-weight: 600;
    opacity: 0.75;
    font-size: 14px;
  }
}
</style>
