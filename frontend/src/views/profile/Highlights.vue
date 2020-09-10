<template>
  <div class="highlights" content>
    <h1>Gesundheit</h1>
    <fh-health-water />
    <br />
    <fh-health-weight :healthData="getData('weight')" />
    <!-- <fh-health-water :onlyToday="true" /> -->
    <h1>Wöchentlich</h1>
    <tl-grid>
      <fh-health-time-w />
      <fh-health-time-c />
      <fh-health-workout7 />
      <fh-health-workout-w />
    </tl-grid>
    <h1>Monatlich</h1>
    <fh-health-workout28 />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { HealthType, IHealth } from '@/utils/interfaces';
import axios from '@/utils/axios';
import FHHealthWater from '@/components/health/FH-Health-Water.vue';
import FHHealthWorkout7 from '@/components/health/FH-Health-Workout7.vue';
import FHHealthWorkout28 from '@/components/health/FH-Health-Workout28.vue';
import FHHealthWorkoutW from '@/components/health/FH-Health-WorkoutW.vue';
import FHHealthTimeW from '@/components/health/FH-Health-TimeW.vue';
import FHHealthTimeC from '@/components/health/FH-Health-TimeC.vue';
import FHHealthWeight from '@/components/health/FH-Health-Weight.vue';

@Component({
  components: {
    'fh-health-weight': FHHealthWeight,
    'fh-health-water': FHHealthWater,
    'fh-health-workout7': FHHealthWorkout7,
    'fh-health-workout28': FHHealthWorkout28,
    'fh-health-workout-w': FHHealthWorkoutW,
    'fh-health-time-w': FHHealthTimeW,
    'fh-health-time-c': FHHealthTimeC
  }
})
export default class Highlights extends Vue {
  public healthData: IHealth[] | null = null;
  public modalOpened = false;
  public selectedSource = 0;

  mounted(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.healthData = (await axios.get('health')).data;
  }

  get waterData(): IHealth[] | null {
    if (!this.healthData) return null;
    return this.healthData.filter(x => x.type === HealthType.WATER);
  }

  async deleteData(id: string) {
    await axios.delete('health/' + id);
    this.loadData();
  }

  public getData(type = 'weight'): IHealth[] | null {
    if (!this.healthData) return null;
    return this.healthData
      .filter(x => x.type === type)
      .sort((a, b) => b.date - a.date);
  }

  public formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }
}
</script>

<style lang="scss" scoped>
.tc-table-2 {
  min-width: 300px;
  margin-bottom: 20px;
  max-width: 90vw;
}
</style>
