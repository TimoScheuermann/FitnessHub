<template>
  <div class="fh-graph-card fh-graph-bmi">
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
        <FHGraphHead
          :timespan="selectedTime"
          :showSpan="true"
          unitLong="BMI"
          unitShort=""
          :amount="amount || 0"
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
      <VueApexCharts
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
import FHGraphHead from './FHGraphHead.vue';
import { TrainingStatistics } from '@/utils/Trainingstatistics';
import { ChartOptions } from '@/utils/ChartOptions';

@Component({
  components: {
    VueApexCharts,
    FHGraphHead
  }
})
export default class FHGraphBMI extends Vue {
  public currentInput = 0;
  public selectedTime = 0;
  public multis = [aDay, aWeek, aMonth, aYear];

  mounted() {
    this.currentInput = this.height || 180;
  }

  get height(): number | null {
    return TrainingStatistics.getHeight();
  }

  get healthData(): IHealth[] | null {
    return TrainingStatistics.getWeight();
  }

  get options() {
    return ChartOptions.bmi(this.multis[this.selectedTime], this.selectedTime);
  }

  get series() {
    const data = (this.healthData || [])
      .map(d => {
        return { x: d.date, y: this.calcBMI(d.value) };
      })
      .sort((a, b) => b.x - a.x);
    return [{ name: 'Gewicht', data: data }];
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

  public submit(): void {
    TrainingStatistics.setHeight(+this.currentInput);
  }

  public showBMIInfo(): void {
    window.open('https://www.bmi-rechner.net/#artikel', '_blank');
  }
}
</script>

<style lang="scss" scoped>
.fh-graph-card {
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
