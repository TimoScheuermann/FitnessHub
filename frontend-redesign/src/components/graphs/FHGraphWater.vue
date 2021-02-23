<template>
  <div class="fh-graph-card fh-graph-water" v-if="$store.getters.valid">
    <template v-if="!onlyToday">
      <tc-segments :dark="$store.getters.darkmode" v-model="timespan">
        <tc-segment-item title="T" />
        <tc-segment-item title="W" />
        <tc-segment-item title="M" />
        <tc-segment-item title="Y" />
      </tc-segments>
      <FHGraphHead
        v-if="timespan !== 0"
        :timespan="timespan"
        :showSpan="true"
        :amount="amount"
      />
      <template v-if="timespan > 0">
        <VueApexCharts
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
        <FHGraphHead
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
import { ChartOptions } from '@/utils/ChartOptions';
import { aDay, aWeek, aYear } from '@/utils/constants';
import { IHealth } from '@/utils/interfaces';
import { TrainingStatistics } from '@/utils/Trainingstatistics';
import VueApexCharts from 'vue-apexcharts';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHGraphHead from './FHGraphHead.vue';

@Component({
  components: {
    FHGraphHead,
    VueApexCharts
  }
})
export default class FHGraphWater extends Vue {
  @Prop({ default: false }) onlyToday!: boolean;

  public timespan = 0;
  public multis = [aDay, aWeek, 4 * aWeek, aYear];
  public intakeValues = [0.25, 0.5, 0.75, 1];
  public recommend = 4;

  get healthData(): IHealth[] | null {
    return TrainingStatistics.getWater();
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
    TrainingStatistics.addWater(amount);
  }

  get options() {
    return ChartOptions.water(
      this.multis[this.timespan],
      this.timespan,
      this.recommend
    );
  }

  get series() {
    const data = (this.healthData || [])
      .map(d => {
        return { x: d.date, y: d.value };
      })
      .sort((a, b) => b.x - a.x);
    return [
      {
        name: 'Liter getrunken',
        data: data
      }
    ];
  }
}
</script>

<style lang="scss" scoped>
.fh-graph-water {
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
