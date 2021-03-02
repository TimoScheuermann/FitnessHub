<template>
  <div class="view-statistics" content>
    <div max-width>
      <tl-flow horizontal="space-between">
        <h3>Allgemein</h3>
        <tc-spinner
          v-if="!generalStats"
          size="20"
          :dark="$store.getters.darkmode"
        />
      </tl-flow>

      <FHAppear>
        <div v-if="generalStats">
          <tl-grid minWidth="120" gap="20">
            <div class="general" v-for="g in generalStats" :key="g.title">
              <i huge success :class="icons[g.title]"></i>
              <div class="amount">{{ g.amount }}</div>
              <div class="title">{{ g.title }}</div>
            </div>
          </tl-grid>
        </div>
      </FHAppear>

      <tl-flow horizontal="space-between">
        <h3>Login Provider</h3>
        <tc-spinner
          v-if="!loginProvider"
          size="20"
          :dark="$store.getters.darkmode"
        />
      </tl-flow>

      <FHAppear>
        <div v-if="loginProvider && series && options" class="chart">
          <VueApexCharts
            type="donut"
            width="100%"
            height="250"
            :series="series"
            :options="options"
          />
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import backend from '@/utils/backend';
import {
  IGeneralStatistics,
  ILoginProviderStatistic
} from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
import VueApexCharts from 'vue-apexcharts';

@Component({
  components: {
    FHAppear,
    VueApexCharts
  }
})
export default class Statistics extends Vue {
  public generalStats: IGeneralStatistics[] | null = null;
  public loginProvider: ILoginProviderStatistic[] | null = null;

  public icons: Record<string, string> = {
    User: 'ti-user-filled',
    Friendships: 'ti-user-shield-duo',
    Messages: 'ti-chat-bubble',
    Workouts: 'ti-list',
    Exercises: 'ti-gym',
    Recipes: 'ti-gastro-assistant',
    'Completed Exercises': 'ti-award',
    Muskeln: 'ti-dots',
    Kategorien: 'ti-book-filled'
  };

  public colors: Record<string, string> = {
    GOOGLE: '#4285f4',
    GITHUB: '#6e5494',
    AMAZON: '#ff9900',
    ADOBE: '#ff0000',
    STEAM: '#00adee',
    FITBIT: '#4cc2c4'
  };

  async mounted() {
    this.generalStats = (await backend.get('statistics/general')).data;
    this.loginProvider = (await backend.get('statistics/loginProvider')).data;
  }

  get options() {
    if (!this.loginProvider) return null;
    return {
      chart: {
        type: 'donut',
        toolbar: { show: false },
        parentHeightOffset: 0,
        background: 'transparent',
        foreColor: this.$store.getters.darkmode && '#fff',
        fontFamily: 'inherit'
      },
      colors: this.loginProvider.map(x => this.colors[x.provider]),
      theme: { mode: this.$store.getters.darkmode ? 'dark' : 'light' },

      labels: this.loginProvider.map(x => x.provider)
    };
  }

  get series() {
    if (!this.loginProvider) return null;
    return this.loginProvider.map(x => x.amount);
  }
}
</script>

<style lang="scss" scoped>
.view-statistics {
  padding-top: 0;

  .general {
    padding: 20px;
    border-radius: $border-radius;
    background: $color_dark;
    @media #{$isDark} {
      background: $color;
    }
    text-align: center;
    .amount {
      font-weight: bold;
      font-size: 22px;
      margin: 10px 0;
    }
    .title {
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 600;
      opacity: 0.7;
      text-align: center;
      overflow-wrap: break-word;
    }
  }
}
</style>
