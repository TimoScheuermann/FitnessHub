<template>
  <div class="fh-health-card fh-health-water">
    <tc-segments :dark="$store.getters.darkmode" v-model="timespan">
      <tc-segment-item title="T" />
      <tc-segment-item title="W" />
      <tc-segment-item title="M" />
      <tc-segment-item title="Y" />
    </tc-segments>
    <fh-health-head :timespan="timespan" :showSpan="true" />
    <fh-chart
      ref="chart"
      width="100%"
      height="250"
      type="bar"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script lang="ts">
import { aDay, aHour, aMonth, aWeek, aYear } from '@/utils/constants';
import { IHealth } from '@/utils/interfaces';
import VueApexCharts from 'vue-apexcharts';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead,
    'fh-chart': VueApexCharts
  }
})
export default class FHHealthWater extends Vue {
  @Prop() healthData!: IHealth[] | null;

  public timespan = 1;
  public multis = [aDay, aWeek, 4 * aWeek, aYear];
  public ticks = [new Date().getHours(), 7, 7 * 4, 12];
  public gaps = [aHour, aDay, aDay, aMonth];

  get options() {
    return {
      chart: {
        toolbar: { show: false },
        parentHeightOffset: 0,
        background: 'transparent',
        foreColor: this.$store.getters.darkmode && '#fff',
        fontFamily: 'inherit'
      },
      xaxis: {
        type: 'datetime',
        max: new Date().getTime(),
        range: this.multis[this.timespan]
      },
      yaxis: {
        opposite: true,
        tickAmount: 0.1,
        forceNiceScale: true,
        labels: { formatter: (value: string) => value + ' l' }
      },
      colors: ['#25ca49'],
      stroke: { lineCap: 'round', width: 4 },
      markers: {
        strokeWidth: 3,
        strokeColors: this.$store.getters.darkmode ? '#28292d' : '#fff'
      },
      tooltip: {
        x: {
          format:
            this.timespan === 0
              ? 'HH U\\hr'
              : this.timespan === 3
              ? 'MMM yyyy'
              : 'dd. MMM yyyy'
        }
      },
      theme: { mode: this.$store.getters.darkmode ? 'dark' : 'light' }
    };
  }

  get series() {
    return [
      {
        name: 'Wassermenge',
        data: this.times.map(x => [x, Math.round(Math.random() * 30)])
      }
    ];
  }

  public getWaterAt(timeStamp: number): number {
    if (!this.healthData) return 0;
    return this.healthData
      .filter(x => this.roundDate(x.date) === timeStamp)
      .map(x => x.value)
      .reduce((a, b) => a + b, 0);
  }

  get times(): number[] {
    const t: number[] = [];
    for (let i = this.ticks[this.timespan]; i >= 0; i--) {
      if (this.timespan === 0) {
        const now = new Date();
        now.setHours(now.getHours() - i);
        now.setMinutes(0);
        now.setSeconds(0);
        t.push(now.getTime());
      } else {
        if (i === this.ticks[this.timespan]) continue;
        t.push(
          this.roundDate(new Date().getTime() - this.gaps[this.timespan] * i)
        );
      }
    }
    return t;
  }

  public roundDate(timeStamp: number | Date): number {
    if (typeof timeStamp !== 'number')
      timeStamp = new Date(timeStamp).getTime();
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000); //subtract amount of time since midnight
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000; //add on the timezone offset
    if (this.timespan === 3) {
      const date = new Date(timeStamp);
      date.setDate(1);
      return date.getTime();
    }
    return timeStamp;
  }
}
</script>

<style lang="scss" scoped></style>
