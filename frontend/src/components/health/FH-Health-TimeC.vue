<template>
  <div
    class="fh-health-card fh-health-time-c"
    :style="'--perc-min:' + percOfMin"
  >
    <fh-health-head average="Trainigszeit" :description="description" />
    <tc-divider :dark="$store.getters.darkmode" />
    <div class="time-bar first" :class="{ min: isThisMin }">
      <div class="title">{{ thisWeek }}<span>min / Tag</span></div>
      <div class="bar">Diese Woche</div>
    </div>
    <div class="time-bar" :class="{ min: isLastMin }">
      <div class="title">{{ lastWeek }}<span>min / Tag</span></div>
      <div class="bar">Letzte Woche</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FHHealthHead from './shared/FH-Health-Head.vue';

@Component({
  components: {
    'fh-health-head': FHHealthHead
  }
})
export default class FHHealthTimeC extends Vue {
  public thisWeek = 105;
  public lastWeek = 138;

  get percOfMin(): string {
    return (
      (Math.min(this.thisWeek, this.lastWeek) /
        Math.max(this.thisWeek, this.lastWeek)) *
        100 +
      '%'
    );
  }
  get isThisMin() {
    return this.thisWeek < this.lastWeek;
  }
  get isLastMin() {
    return this.thisWeek > this.lastWeek;
  }

  get description(): string {
    const diff = this.thisWeek - this.lastWeek;
    if (diff < 0)
      return 'Diese Woche hast du weniger trainiert als letzte Woche. Gib nochmal alles, dann schaffst du es!';
    if (diff > 0)
      return (
        'Starke Leistung ' +
        this.$store.getters.user.givenName +
        '! Du hast in dieser Woche mehr trainiert als in der letzten Woche.'
      );
    return 'Du hast in dieser Woche genau so viele Minuten trainiert wie in der letzten Woche. Sehr gut!';
  }
}
</script>

<style lang="scss" scoped>
.fh-health-time-c {
  .time-bar {
    &:not(.first) {
      margin-top: 10px;
    }
    &.first {
      .bar {
        background: $success;
        color: #fff;
      }
    }
    .title {
      font-size: 1.5em;
      font-weight: bold;
      span {
        font-size: 16px;
        margin-left: 3px;
        opacity: 0.75;
      }
    }
    &.min .bar {
      width: calc(var(--perc-min) - 20px);
    }
    .bar {
      margin-top: 5px;
      font-size: 14px;
      padding: 5px 10px;
      border-radius: $border-radius;

      background: $container;
      @media (prefers-color-scheme: dark) {
        background: $container_dark;
      }
    }
  }
}
</style>
