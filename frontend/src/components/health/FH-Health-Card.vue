<template>
  <div class="fh-health-card" :class="{ dark: $store.getters.darkmode }">
    <template v-if="!healthData">
      <tl-flow flow="column" loading>
        <tc-spinner :dark="$store.getters.darkmode" size="20" />
        <span class="info">Daten werden geladen</span>
      </tl-flow>
    </template>
    <template v-else-if="healthData.length === 0">
      <div class="no-data">
        <div class="title">Es konnten keine Daten gefunden werden...</div>
        <div class="subtitle">
          Trage dein {{ currentHead }} ein, um deinen Verlauf zu tracken
        </div>
      </div>
    </template>
    <template v-else>
      <tc-segments v-model="selectedTime" :dark="$store.getters.darkmode">
        <tc-segment-item title="T" />
        <tc-segment-item title="W" />
        <tc-segment-item title="M" />
        <tc-segment-item title="J" />
      </tc-segments>
      <div class="head">
        <div class="type">
          {{ selectedTime === 0 ? category : 'durchschnitt' }}
        </div>
        <div class="amount">
          {{ amount }}<span>{{ unit }}</span>
        </div>
        <div class="time">{{ now }}</div>
      </div>
      <fh-chart
        width="100%"
        height="250"
        type="line"
        :options="options"
        :series="series"
      />
    </template>
    <template v-if="healthData">
      <div class="current">
        <span>{{ currentHead }}</span> ({{ unit }})
      </div>
      <div class="add-data">
        <div>
          <tc-input
            :dark="$store.getters.darkmode"
            :step="step"
            type="number"
            :buttons="true"
            v-model="currentInput"
          />
        </div>
        <tc-button @click="submit" name="Speichern" variant="filled" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import VueApexCharts from 'vue-apexcharts';
import { IHealth } from '@/utils/interfaces';
import { days, months, aDay, aWeek, aMonth, aYear } from '@/utils/constants';
import axios from '@/utils/axios';

@Component({
  components: {
    'fh-chart': VueApexCharts
  }
})
export default class FHHealthCard extends Vue {
  @Prop() healthData!: IHealth[] | null;
  @Prop({ default: 'weight' }) endpoint!: string;
  @Prop({ default: 'Gewicht' }) category!: string;
  @Prop({ default: 'kg' }) unit!: string;
  @Prop({ default: 'aktuelles Gewicht' }) currentHead!: string;
  @Prop({ default: 0.1 }) step!: number;

  public currentInput =
    this.healthData && this.healthData.length > 0 ? this.current : 70;
  public selectedTime = 1;
  public multis = [aDay, aWeek, aMonth, aYear];

  @Watch('healthData')
  dataChanged() {
    this.currentInput =
      this.healthData && this.healthData.length > 0 ? this.current : 70;
  }

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
        range: this.multis[this.selectedTime],
        max: new Date().getTime()
      },
      yaxis: {
        opposite: true,
        tickAmount: 0.1,
        forceNiceScale: true,
        labels: { formatter: (value: string) => value + ' ' + this.unit }
      },
      colors: ['#25ca49'],
      stroke: { lineCap: 'round', width: 4 },
      markers: {
        size: this.selectedTime < 2 ? 5 : 0,
        strokeWidth: 3
      },
      tooltip: {
        x: { format: 'dd. MMM yyyy' }
      }
    };
  }

  get series() {
    return [
      {
        name: this.category,
        data: (this.healthData || [])
          .map(d => {
            return {
              x: d.date,
              y: d.value
            };
          })
          .sort((a, b) => b.x - a.x)
      }
    ];
  }

  get now(): string {
    const date: Date = new Date();
    return `${days[date.getDay()]}, ${date.getDate()}. ${
      months[date.getMonth() - 1]
    } ${date.getFullYear()}`;
  }

  get current(): number {
    if (!this.healthData) return 70;
    return this.healthData.sort((a, b) => b.date - a.date)[0].value;
  }

  get amount(): number {
    if (!this.healthData) return -1;
    if (this.selectedTime === 0) {
      return this.current;
    }
    const latest = new Date().getTime() - this.multis[this.selectedTime];
    const resultingData = this.healthData
      .filter(x => x.date >= latest)
      .map(x => x.value);
    const sum = resultingData.reduce((a, b) => a + b, 0);
    return Math.round((sum / resultingData.length) * 100) / 100;
  }

  async submit(): Promise<void> {
    await axios.post('health/' + this.endpoint, { value: +this.currentInput });
    this.$emit('reload');
  }
}
</script>

<style lang="scss" scoped>
.fh-health-card {
  background: $paragraph;
  &.dark {
    background: $paragraph_dark;
  }
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
      span {
        font-size: 20px;
        opacity: 0.5;
        margin-left: 3px;
      }
    }
    .time {
      font-weight: 600;
      opacity: 0.75;
    }
  }
  .current {
    font-weight: 500;
    opacity: 0.75;
    margin: 5px;
    font-size: 18px;
    span {
      text-transform: capitalize;
    }
  }
  .add-data {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(100px, auto);
    grid-gap: 0;
  }

  [loading] {
    margin: 10px;
    opacity: 0.6;
    .info {
      margin-top: 10px;
      font-weight: 500;
    }
  }
  .no-data {
    margin: 5px;
    .title {
      font-size: 1.2em;
      font-weight: 600;
    }
    .subtitle {
      margin-top: 5px;
      margin-bottom: 20px;
    }
  }
}
</style>
