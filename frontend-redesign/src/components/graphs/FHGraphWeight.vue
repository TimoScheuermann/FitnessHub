<template>
  <div class="fh-graph-card fh-graph-weight">
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
      <FHGraphHead
        :timespan="selectedTime"
        :showSpan="true"
        unitLong="Gewicht"
        unitShort="kg"
        :amount="amount || 0"
      />
      <VueApexCharts
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
export default class FHGraphWeight extends Vue {
  public currentInput = this.current;
  public selectedTime = 1;
  public multis = [aDay, aWeek, aMonth, aYear];

  get healthData(): IHealth[] | null {
    return TrainingStatistics.getWeight();
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
    return ChartOptions.weight(
      this.multis[this.selectedTime],
      this.selectedTime
    );
  }

  get series() {
    const data = (this.healthData || [])
      .map(d => {
        return { x: d.date, y: d.value };
      })
      .sort((a, b) => b.x - a.x);
    return [{ name: 'Gewicht', data: data }];
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

  public submit(): void {
    TrainingStatistics.addWeight(+this.currentInput);
  }
}
</script>

<style lang="scss" scoped>
.fh-graph-card {
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
