<template>
  <div class="landing" content>
    <tc-segments :dark="$store.getters.darkmode">
      <tc-segment-item title="Timer">
        <fh-timer />
      </tc-segment-item>
      <tc-segment-item title="Stoppuhr">
        <fh-stopwatch />
      </tc-segment-item>
    </tc-segments>
  </div>
</template>

<script lang="ts">
import FHStopwatch from '@/components/home/FH-Stopwatch.vue';
import FHTimer from '@/components/home/FH-Timer.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-timer': FHTimer,
    'fh-stopwatch': FHStopwatch
  }
})
export default class Landing extends Vue {}
</script>

<style lang="scss" scoped>
[content] {
  padding-top: 20px;
}
</style>
