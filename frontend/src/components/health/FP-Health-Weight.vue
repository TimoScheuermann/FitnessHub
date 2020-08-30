<template>
  <div class="fp-health-weight">
    <tc-segments v-model="selectedTime">
      <tc-segment-item title="D" />
      <tc-segment-item title="W" />
      <tc-segment-item title="M" />
      <tc-segment-item title="Y" />
    </tc-segments>
    <div class="head">
      <div class="type">
        {{ selectedTime === 0 ? 'gewicht' : 'durchschnitt' }}
      </div>
      <div class="amount">{{ amount }}</div>
      <div class="time">{{ now }}</div>
    </div>
    <template v-if="data">
      <fp-chart width="100%" type="line" :options="options" :series="series" />
    </template>
    <tc-divider />
    <tl-flow>
      <span>Aktuelles Gewicht</span>
    </tl-flow>
    <tl-flow>
      <tc-input :value="current" type="number" :buttons="true" />
      <tc-button name="Speichern" variant="filled" />
    </tl-flow>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import VueApexCharts from 'vue-apexcharts';
import { IHealth } from '@/utils/interfaces';

@Component({
  components: {
    'fp-chart': VueApexCharts
  }
})
export default class FPHealthWeight extends Vue {
  @Prop() data!: IHealth[];

  public days = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag'
  ];
  public months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
  ];
  public selectedTime = 0;
  public multis = [1, 7, 31, 364];
  get options() {
    return {
      chart: { toolbar: { show: false } },
      xaxis: {
        type: 'datetime',
        range: 1000 * 60 * 60 * 24 * this.multis[this.selectedTime],
        max: new Date().getTime()
      },
      yaxis: { opposite: true },
      colors: ['#08f']
    };
  }

  public series = [
    {
      name: 'KG',
      data: (this.data || []).map(d => {
        return {
          x: d.date,
          y: d.value
        };
      })
    }
  ];

  get now(): string {
    const date: Date = new Date();
    return `${this.days[date.getDay()]}, ${date.getDate()}. ${
      this.months[date.getMonth() - 1]
    } ${date.getFullYear()}`;
  }

  get current(): number {
    return this.data.sort((a, b) => b.date - a.date)[0].value;
  }
  get amount(): number {
    if (this.selectedTime === 0) {
      return this.current;
    }
    const latest =
      new Date().getTime() -
      1000 * 60 * 60 * 24 * this.multis[this.selectedTime];
    const resultingData = this.data
      .filter(x => x.date >= latest)
      .map(x => x.value);
    const sum = resultingData.reduce((a, b) => a + b, 0);
    return Math.round((sum / resultingData.length) * 100) / 100;
  }
}
</script>

<style lang="scss" scoped>
.fp-health-weight {
  background: $paragraph;
  padding: 10px;
  border-radius: $border-radius;
  .head {
    .type {
      text-transform: uppercase;
      font-weight: 600;
      opacity: 0.5;
    }
    .amount {
      font-size: 2em;
      font-weight: bold;
      &::after {
        font-size: 20px;
        opacity: 0.5;
        content: ' kg';
      }
    }
    .time {
      font-weight: 600;
      opacity: 0.75;
    }
  }
}
/deep/ .tc-segments--head__item {
  padding: 0px !important;
}
</style>
