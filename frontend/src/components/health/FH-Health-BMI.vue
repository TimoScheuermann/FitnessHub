<template>
  <div class="fh-health-card fh-health-bmi">
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
          Trage dein aktuelles Gewicht ein, um deinen Verlauf deines BMI zu
          tracken
        </div>
      </div>
    </template>
    <template v-else-if="height">
      <tc-segments v-model="selectedTime" :dark="$store.getters.darkmode">
        <tc-segment-item title="T" />
        <tc-segment-item title="W" />
        <tc-segment-item title="M" />
        <tc-segment-item title="J" />
      </tc-segments>
      <tl-flow horizontal="space-between">
        <fh-health-head
          :timespan="selectedTime"
          :showSpan="true"
          unitLong="BMI"
          unitShort=""
          :amount="amount"
        />
        <tc-tooltip
          v-if="selectedTime === 0"
          position="left"
          tooltip="Was ist der BMI"
        >
          <div class="help-button" @click="showBMIInfo">
            <i class="ti-question-circle"></i>
          </div>
        </tc-tooltip>
      </tl-flow>
      <fh-chart
        v-if="selectedTime !== 0"
        width="100%"
        height="250"
        type="line"
        :options="options"
        :series="series"
      />
    </template>
    <template>
      <div class="add-data">
        <div>
          <tc-input
            title="Aktuelle Größe (cm)"
            :dark="$store.getters.darkmode"
            :step="1"
            type="number"
            :buttons="true"
            v-model="currentInput"
          />
        </div>
        <tl-flow vertical="end">
          <tc-button
            :disabled="$store.getters.loading"
            tfbackground="success"
            @click="submit"
            name="Speichern"
            variant="filled"
          />
        </tl-flow>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
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
export default class FHHealthBMI extends Vue {
  public currentInput = 0;
  public selectedTime = 0;
  public multis = [aDay, aWeek, aMonth, aYear];

  mounted() {
    if (!this.healthData) {
      axios.get('health/weight').then(res => {
        res.data.forEach((x: IHealth) => this.$store.commit('addWeight', x));
      });
    }
    this.currentInput = this.height || 180;
  }

  get height(): number | null {
    const height = this.$store.getters.height;
    if (!height || height < 0) return null;
    return height;
  }

  get healthData(): IHealth[] | null {
    return this.$store.getters.weight;
  }

  // chart options (see ApexCharts Docs for further informations)
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
        min: 10,
        tickAmount: 5,
        max: 40,
        labels: { formatter: (value: string) => value + ' BMI' }
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
      theme: { mode: this.$store.getters.darkmode ? 'dark' : 'light' },
      annotations: {
        yaxis: [
          {
            y: 20,
            y2: 25,
            borderColor: '#08f',
            borderWidth: 2,
            strokeDashArray: 0,
            fillColor: '#08f',
            opacity: 0.2,
            label: {
              borderWidth: 0,
              text: 'Normalgewicht',
              position: 'left',
              offsetX: 80,
              offsetY: 50,
              style: {
                fontSize: '14px',
                fontWeight: 500,
                color: '#08f',
                background: 'transparent'
              }
            }
          }
        ]
      }
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
              y: this.calcBMI(d.value)
            };
          })
          .sort((a, b) => b.x - a.x)
      }
    ];
  }

  public calcBMI(value: number, height: number | null = this.height): number {
    if (!this.height) return 0;
    return Math.round((value / Math.pow((height || 1.8) / 100, 2)) * 10) / 10;
  }

  get current(): number {
    if (!this.healthData) return 21;
    const weight = this.healthData.sort((a, b) => b.date - a.date)[0].value;
    return this.calcBMI(weight);
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

  public async submit(): Promise<void> {
    await axios.post('health/height', { amount: +this.currentInput });
    this.$store.commit('setHeight', +this.currentInput);
  }

  public showBMIInfo(): void {
    window.open('https://www.bmi-rechner.net/#artikel', '_blank');
  }
}
</script>

<style lang="scss" scoped>
.fh-health-card {
  .help-button {
    font-size: 1.3em;
    opacity: 0.7;
    transition: 0.2s ease-in-out;
    &:hover {
      opacity: 1;
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
