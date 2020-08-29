<template>
  <div class="inbox" content>
    <tl-flow horizontal="space-between">
      <h1>Gewicht</h1>
      <tc-spinner v-if="!healthData" size="20" />
    </tl-flow>

    <template v-if="healthData">
      <fp-health-weight :data="healthData" />
      <!-- <p>{{ healthData }}</p> -->
    </template>

    <!-- <tc-input type="number" v-model="weight" :buttons="true" />
    <tc-button @click="submitWeight" name="Submit weight" /> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IHealth } from '@/utils/interfaces';
import axios from '@/utils/axios';
import FPHealthWeight from '@/components/health/FP-Health-Weight.vue';

@Component({
  components: {
    'fp-health-weight': FPHealthWeight
  }
})
export default class Inbox extends Vue {
  public healthData: IHealth[] | null = null;
  public weight = 84;

  mounted(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.healthData = (await axios.get('health')).data;
  }

  async submitWeight(): Promise<void> {
    console.log('submitting');
    await axios.post('health/weight', { value: +this.weight });
    this.loadData();
  }
}
</script>

<style lang="scss" scoped></style>
