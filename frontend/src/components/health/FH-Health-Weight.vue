<template>
  <div class="fh-health-card fh-health-weight">
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
          Trage dein aktuelles Gewicht ein, um deinen Verlauf zu tracken
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
      <fh-health-head
        :timespan="selectedTime"
        :showSpan="true"
        unitLong="Gewicht"
        unitShort="kg"
        :amount="amount"
      />
      <fh-chart
        width="100%"
        height="250"
        type="line"
        :options="options"
        :series="series"
      />
    </template>
    <template v-if="healthData">
      <div class="add-data">
        <div>
          <tc-input
            title="Aktuelles Gewicht (kg)"
            :dark="$store.getters.darkmode"
            :step="0.1"
            type="number"
            :buttons="true"
            v-model="currentInput"
            @input="round"
          />
        </div>
        <tl-flow vertical="end">
          <tc-button
            tfbackground="success"
            @click="submit"
            name="Speichern"
            variant="filled"
            :disabled="$store.getters.loading"
          />
        </tl-flow>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import VueApexCharts from 'vue-apexcharts';
import { IHealth } from '@/utils/interfaces';
import { aDay, aWeek, aMonth, aYear } from '@/utils/constants';
import axios from '@/utils/axios';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-chart': VueApexCharts,
    'fh-health-head': FHHealthHead
  }
})
export default class FHHealthWeight extends Vue {
  @Prop() healthData!: IHealth[] | null;

  public currentInput =
    this.healthData && this.healthData.length > 0 ? this.current : 70;
  public selectedTime = 1;
  public multis = [aDay, aWeek, aMonth, aYear];

  @Watch('healthData')
  dataChanged() {
    this.currentInput =
      this.healthData && this.healthData.length > 0 ? this.current : 70;
  }

  public round() {
    const split = (this.currentInput + '').split('.');
    if (split.length > 1) {
      this.currentInput = +(split[0] + '.' + (split[1] + '00').substring(0, 2));
    } else {
      this.currentInput = +split[0];
    }
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
        labels: { formatter: (value: string) => value + ' kg' }
      },
      colors: ['#25ca49'],
      stroke: { lineCap: 'round', width: 4 },
      markers: {
        size: this.selectedTime < 2 ? 5 : 0,
        strokeWidth: 3,
        strokeColors: this.$store.getters.darkmode ? '#28292d' : '#fff'
      },
      tooltip: {
        x: { format: 'dd. MMM yyyy' }
      },
      theme: { mode: this.$store.getters.darkmode ? 'dark' : 'light' }
    };
  }

  get series() {
    return [
      {
        name: 'Gewicht',
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
    await axios.post('health/weight', { value: +this.currentInput });
    this.$emit('reload');
  }
}
</script>

<style lang="scss" scoped>
.fh-health-card {
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
      font-size: 14px;
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
