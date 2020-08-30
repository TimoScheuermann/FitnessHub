<template>
  <div class="inbox" content>
    <tl-grid>
      <div>
        <tl-flow horizontal="space-between">
          <h1>Gewicht</h1>
          <tc-spinner v-if="!healthData" size="20" />
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
          <tc-spinner v-if="!healthData" size="20" />
        </tl-flow>
        <fh-health-card
          :healthData="getData('height')"
          @reload="loadData"
          endpoint="height"
          category="Größe"
          unit="cm"
          currentHead="aktuelle Größe"
          :step="1"
        />
      </div>
    </tl-grid>
    <h1>Daten verwalten</h1>
    <tc-button
      name="Datenquellen ansehen"
      variant="filled"
      @click="modalOpened = true"
    />

    <tc-modal v-model="modalOpened">
      <template slot="header">
        <h2>Datenquellen</h2>
        <tc-segments v-model="selectedSource">
          <tc-segment-item title="Gewicht" />
          <tc-segment-item title="Größe" />
        </tc-segments>
      </template>

      <tc-table>
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
import { IHealth } from '@/utils/interfaces';
import axios from '@/utils/axios';
import FHHealthCard from '@/components/health/FH-Health-Card.vue';

@Component({
  components: {
    'fh-health-card': FHHealthCard
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
