<template>
  <div class="inbox" content>
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

  mounted(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.healthData = (await axios.get('health')).data;
  }

  public getData(type = 'weight'): IHealth[] | null {
    if (!this.healthData) return null;
    return this.healthData.filter(x => x.type === type);
  }
}
</script>

<style lang="scss" scoped></style>
