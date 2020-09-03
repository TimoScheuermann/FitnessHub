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
      <tl-grid minWidth="150" v-if="generalStats">
        <tc-card :dark="$store.getters.darkmode" class="stat" :rounded="true">
          <!-- <i class="ti-users" /> -->
          <div class="amount">{{ generalStats.users }}</div>
          <div class="name">Users</div>
        </tc-card>
        <tc-card :dark="$store.getters.darkmode" class="stat" :rounded="true">
          <!-- <i class="ti-heart" /> -->
          <div class="amount">{{ generalStats.friendships }}</div>
          <div class="name">Friendships</div>
        </tc-card>
        <tc-card :dark="$store.getters.darkmode" class="stat" :rounded="true">
          <!-- <i class="ti-calendar-alt" /> -->
          <div class="amount">{{ generalStats.workouts }}</div>
          <div class="name">Workouts</div>
        </tc-card>
        <tc-card :dark="$store.getters.darkmode" class="stat" :rounded="true">
          <!-- <i class="ti-gym" /> -->
          <div class="amount">{{ generalStats.exercises }}</div>
          <div class="name">Exercises</div>
        </tc-card>
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
                Math.round((prov.amount / generalStats.users) * 10000) / 100
              }}%
            </div>
          </tl-flow>
          <tc-progress
            :dark="$store.getters.darkmode"
            :percent="(prov.amount / generalStats.users) * 100"
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
  public generalStats: IGeneralStatistics | null = null;
  public loginProvider: ILoginProviderStatistic[] | null = null;

  async mounted() {
    this.generalStats = (await axios.get('statistics/general')).data;
    this.loginProvider = (await axios.get('statistics/loginProvider')).data;
  }
}
</script>

<style lang="scss" scoped>
.stat {
  i {
    font-size: 2em;
  }
  .amount {
    color: $primary;
    font-weight: bold;
    font-size: 2em;
  }
  .name {
    font-weight: 500;
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
