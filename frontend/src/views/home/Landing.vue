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
    <h1>Workout</h1>
    <tl-grid minWidth="100">
      <router-link :to="{ name: 'training' }">
        <tc-magic-card
          src="https://images.unsplash.com/photo-1539794830467-1f1755804d13?w=540&q=5"
          :dark="true"
        >
          <div class="tile-title" slot="thumbnail">Starten</div>
        </tc-magic-card>
      </router-link>
      <div @click.capture="createWorkout">
        <tc-magic-card
          src="https://images.unsplash.com/photo-1547919307-1ecb10702e6f?w=540&q=5"
          :dark="true"
        >
          <div class="tile-title" slot="thumbnail">Erstellen</div>
        </tc-magic-card>
      </div>
    </tl-grid>
  </div>
</template>

<script lang="ts">
import FHStopwatch from '@/components/home/FH-Stopwatch.vue';
import FHTimer from '@/components/home/FH-Timer.vue';
import { EventBus } from '@/utils/eventbus';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-timer': FHTimer,
    'fh-stopwatch': FHStopwatch
  }
})
export default class Landing extends Vue {
  public createWorkout(event: MouseEvent) {
    event.stopPropagation();
    EventBus.$emit('add-to-workout');
  }
}
</script>

<style lang="scss" scoped>
[content] {
  padding-top: 20px;
}
.landing {
  .tile-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    font-weight: 700;
    text-align: center;
  }
}
</style>
