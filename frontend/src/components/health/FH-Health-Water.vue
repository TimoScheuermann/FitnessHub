<template>
  <div class="fh-health-card fh-health-water">
    <template v-if="!onlyToday">
      <tc-segments :dark="$store.getters.darkmode" v-model="timespan">
        <tc-segment-item title="T" />
        <tc-segment-item title="W" />
        <tc-segment-item title="M" />
        <tc-segment-item title="Y" />
      </tc-segments>
      <fh-health-head
        v-if="timespan !== 0"
        :timespan="timespan"
        :showSpan="true"
        :amount="amount"
      />
      <template v-if="timespan > 0">
        <fh-chart
          width="100%"
          height="250"
          type="line"
          :options="options"
          :series="series"
        />
      </template>
    </template>
    <div class="water-only-today" v-if="timespan === 0">
      <tl-flow horizontal="space-between">
        <fh-health-head
          :timespan="0"
          :amount="today"
          unitLong="Trinkometer"
          :showSpan="true"
        />
        <div class="progress">
          <tc-progress
            tfcolor="success"
            ringSize="80"
            ringWidth="8"
            type="ring"
            :percent="Math.min(100, percentage)"
            :dark="$store.getters.darkmode"
          />
          <div class="amount">{{ percentage }}%</div>
        </div>
      </tl-flow>
    </div>
    <div class="intakes">
      <div class="intake" v-for="i in intakeValues" :key="i" @click="add(i)">
        +{{ i }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { aDay, aWeek, aYear } from '@/utils/constants';
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
  @Prop({ default: false }) onlyToday!: boolean;

  public timespan = 0;
  public multis = [aDay, aWeek, 4 * aWeek, aYear];
  public intakeValues = [0.25, 0.5, 0.75, 1];
  public recommend = 4;

  mounted() {
    if (!this.healthData) {
      axios.get('health/water').then(res => {
        res.data.forEach((x: IHealth) => this.$store.commit('addWater', x));
      });
    }
  }

  get healthData(): IHealth[] | null {
    return this.$store.getters.water;
  }

  get today(): number {
    if (!this.healthData) return 0;
    const today = this.healthData.filter(
      x => x.date === new Date().setHours(0, 0, 0, 0)
    )[0];
    if (today) return today.value;
    return 0;
  }

  get percentage(): number {
    return (this.today / this.recommend) * 100;
  }

  get amount(): number {
    if (!this.healthData) return -1;
    if (this.timespan === 0) {
      return this.today;
    }
    const latest = new Date().getTime() - this.multis[this.timespan];
    const resultingData = this.healthData
      .filter(x => x.date >= latest)
      .map(x => x.value);
    const sum = resultingData.reduce((a, b) => a + b, 0);
    return Math.round((sum / resultingData.length) * 100) / 100;
  }

  public add(amount: number) {
    if (!this.$store.getters.loading) {
      axios.post('health/water', { amount: amount }).then(res => {
        this.$store.commit('addWater', res.data);
      });
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
        range: this.multis[this.timespan],
        max: new Date().getTime()
      },
      yaxis: {
        opposite: true,
        tickAmount: 1,
        min: 0,
        max: 10,
        labels: { formatter: (value: string) => value + ' l' }
      },
      annotations: {
        yaxis: [
          {
            y: this.recommend,
            borderColor: '#08f',
            borderWidth: 2,
            strokeDashArray: 0,
            opacity: 0.1,
            label: {
              borderWidth: 0,
              text: 'Empfehlung',
              position: 'left',
              offsetX: 80,
              style: {
                fontSize: '14px',
                fontWeight: 500,
                color: this.$store.getters.darkmode && '#fff',
                background: 'transparent'
              }
            }
          }
        ]
      },
      colors: ['#25ca49'],
      stroke: { lineCap: 'round', width: 4 },
      markers: {
        size: this.timespan < 2 ? 5 : 0,
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
        name: 'Liter getrunken',
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
}
</script>

<style lang="scss" scoped>
.fh-health-water {
  .intakes {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
    margin-top: 10px;
    user-select: none;
    .intake {
      padding: 10px;
      text-align: center;
      border-radius: $border-radius;
      background: $container;
      @media (prefers-color-scheme: dark) {
        background: $container_dark;
      }

      cursor: pointer;
      font-weight: bold;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }
  }
  .water-only-today {
    .progress {
      position: relative;
      .amount {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.5;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
