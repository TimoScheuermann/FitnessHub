<template>
  <div class="statistics">
    <div content>
      <tl-flow horizontal="space-between">
        <h1>General</h1>
        <tc-spinner
          :dark="$store.getters.darkmode"
          size="20"
          v-if="!generalStats"
        />
      </tl-flow>
      <tl-grid gap="20" v-if="generalStats">
        <tl-flow
          v-for="s in generalStats"
          :key="s.title"
          horizontal="space-between"
          class="general-stat"
        >
          <div class="amount">{{ s.amount }}</div>
          <div class="name">{{ s.title }}</div>
        </tl-flow>
      </tl-grid>

      <tl-flow horizontal="space-between">
        <h1>Login Provider</h1>
        <tc-spinner
          :dark="$store.getters.darkmode"
          size="20"
          v-if="!loginProvider"
        />
      </tl-flow>

      <div class="login-provider" v-if="loginProvider && generalStats">
        <div
          class="provider"
          v-for="prov in loginProvider"
          :key="prov.provider"
        >
          <tl-flow horizontal="space-between">
            <div class="name">
              <span>{{ prov.provider }}:</span> {{ prov.amount }} User
            </div>
            <div class="percent">
              {{
                Math.round((prov.amount / generalStats[0].amount) * 10000) /
                  100
              }}%
            </div>
          </tl-flow>
          <tc-progress
            :dark="$store.getters.darkmode"
            :percent="(prov.amount / generalStats[0].amount) * 100"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {
  IGeneralStatistics,
  ILoginProviderStatistic
} from '@/utils/interfaces';
import axios from '@/utils/axios';

@Component
export default class Statistics extends Vue {
  public generalStats: IGeneralStatistics[] | null = null;
  public loginProvider: ILoginProviderStatistic[] | null = null;

  async mounted() {
    this.generalStats = (await axios.get('statistics/general')).data;
    this.loginProvider = (await axios.get('statistics/loginProvider')).data;
  }
}
</script>

<style lang="scss" scoped>
.general-stat {
  background: $paragraph;
  padding: 10px 20px;
  border-radius: $border-radius;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
  .amount {
    color: $primary;
    font-weight: bold;
    font-size: 1.3em;
  }
  .name {
    font-weight: 500;
    white-space: pre;
    word-wrap: break-word;
  }
}
.login-provider {
  .provider {
    margin-bottom: 10px;
    .name {
      span {
        font-weight: bold;
        font-style: normal;
      }
      font-style: italic;
    }
  }
}
</style>
