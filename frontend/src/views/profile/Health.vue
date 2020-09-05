<template>
  <div class="health" content>
    <h1>Wasser</h1>
    <fh-health-water :healthData="waterData" />
    <h1>Workouts</h1>
    <fh-health-workout7 />
    <br />
    <fh-health-workout28 />

    <h1>.</h1>
    <tc-divider :dark="$store.getters.darkmode" name="OLD" />
    <tl-grid>
      <div>
        <tl-flow horizontal="space-between">
          <h1>Gewicht</h1>
          <tc-spinner
            :dark="$store.getters.darkmode"
            v-if="!healthData"
            size="20"
          />
        </tl-flow>
        <fh-health-card
          :healthData="getData('weight')"
          @reload="loadData"
          endpoint="weight"
          category="Gewicht"
          unit="kg"
          currentHead="aktuelles Gewicht"
          :step="0.1"
        />
      </div>
      <div>
        <tl-flow horizontal="space-between">
          <h1>Größe</h1>
          <tc-spinner
            :dark="$store.getters.darkmode"
            v-if="!healthData"
            size="20"
          />
        </tl-flow>
        <fh-health-card
          :healthData="getData('water')"
          @reload="loadData"
          endpoint="water"
          category="Liter"
          unit="l"
          currentHead="Weitere Liter"
          :step="1"
        />
      </div>
    </tl-grid>
    <h1>Daten verwalten</h1>
    <tc-button
      name="Datenquellen ansehen"
      variant="filled"
      tfbackground="success"
      @click="modalOpened = true"
    />

    <tc-modal v-model="modalOpened" :dark="$store.getters.darkmode">
      <template slot="header">
        <h2>Datenquellen</h2>
        <tc-segments v-model="selectedSource" :dark="$store.getters.darkmode">
          <tc-segment-item title="Gewicht" />
          <tc-segment-item title="Größe" />
        </tc-segments>
      </template>

      <tc-table :dark="$store.getters.darkmode">
        <tc-tr
          v-for="hd in getData(selectedSource === 0 ? 'weight' : 'height')"
          :key="hd._id"
        >
          <tc-td>{{ formatDate(hd.date) }}</tc-td>
          <tc-td>{{ hd.value }}</tc-td>
          <tc-td>
            <tc-link tfcolor="error" @click="deleteData(hd._id)">
              löschen
            </tc-link>
          </tc-td>
        </tc-tr>
      </tc-table>
    </tc-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { HealthType, IHealth } from '@/utils/interfaces';
import axios from '@/utils/axios';
import FHHealthCard from '@/components/health/FH-Health-Card.vue';
import FHHealthWater from '@/components/health/FH-Health-Water.vue';
import FHHealthWorkout7 from '@/components/health/FH-Health-Workout7.vue';
import FHHealthWorkout28 from '@/components/health/FH-Health-Workout28.vue';

@Component({
  components: {
    'fh-health-card': FHHealthCard,
    'fh-health-water': FHHealthWater,
    'fh-health-workout7': FHHealthWorkout7,
    'fh-health-workout28': FHHealthWorkout28
  }
})
export default class Inbox extends Vue {
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
