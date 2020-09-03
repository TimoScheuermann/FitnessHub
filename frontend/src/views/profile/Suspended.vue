<template>
  <div class="suspended" content>
    <h1>Anmeldung aktuell nicht möglich</h1>
    <p>
      Dein Account wurde gesperrt, da du gegen unsere Richtlinien verstoßen
      hast.
    </p>

    <template v-if="time">
      <tc-divider :dark="$store.getters.darkmode" />
      <p>Die Sperrung endet in</p>
      <h2>{{ until }}</h2>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { formatDate } from '@/utils/functions';

@Component
export default class Suspended extends Vue {
  get time() {
    return this.$route.query.t;
  }
  get until() {
    if (this.time) return formatDate(+this.time);
    return '';
  }
}
</script>

<style lang="scss" scoped>
h1,
h2,
p {
  text-align: center;
}
h2 {
  margin-top: 0px;
  color: $error;
}
</style>
