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
      />
      <template v-if="timespan > 0">
        <br />
        soon
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

      <div class="intakes">
        <div class="intake" v-for="i in intakeValues" :key="i" @click="add(i)">
          +{{ i }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { aDay, aWeek, aYear } from '@/utils/constants';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead
  }
})
export default class FHHealthWater extends Vue {
  @Prop({ default: false }) onlyToday!: boolean;

  public timespan = 0;
  public multis = [aDay, aWeek, 4 * aWeek, aYear];
  public intakeValues = [0.25, 0.5, 0.75, 1];
  public today = 2.5;
  public recommend = 4;

  get percentage(): number {
    return (this.today / this.recommend) * 100;
  }

  public add(amount: number) {
    this.today += +amount;
  }
}
</script>

<style lang="scss" scoped>
.fh-health-water {
  .water-only-today {
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
        background: $container_dark;
        cursor: pointer;
        font-weight: bold;
        opacity: 0.7;
        &:hover {
          opacity: 1;
        }
      }
    }
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
