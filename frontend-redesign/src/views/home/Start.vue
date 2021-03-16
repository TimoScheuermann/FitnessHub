<template>
  <div class="view-start" content>
    <div max-width>
      <tl-flow>
        <tc-segments :dark="$store.getters.darkmode">
          <tc-segment-item title="Timer">
            <FHTimer />
          </tc-segment-item>
          <tc-segment-item title="Stoppuhr">
            <FHStopwatch />
          </tc-segment-item>
        </tc-segments>
      </tl-flow>

      <br />
      <br />
      <tl-grid minWidth="100" gap="20">
        <FHPreview
          title="Training starten"
          :height="110"
          @click="$oFS('training')"
        >
          <video slot="media" playsinline autoplay="autoplay" loop muted>
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-runner-does-stretch-routine-with-city-bridge-in-background-15801-small.mp4"
            />
          </video>
        </FHPreview>

        <FHPreview
          title="Workout erstellen"
          :height="110"
          @click="$oFS('create-workout')"
        >
          <video slot="media" playsinline autoplay="autoplay" loop muted>
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-ropes-in-the-gym-23141-small.mp4"
            />
          </video>
        </FHPreview>
      </tl-grid>
    </div>
  </div>
</template>

<script lang="ts">
import FHPreview from '@/components/FHPreview.vue';
import FHStopwatch from '@/components/home/FHStopwatch.vue';
import FHTimer from '@/components/home/FHTimer.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHTimer,
    FHStopwatch,
    FHPreview
  }
})
export default class Start extends Vue {
  mounted() {
    this.startVideo();
  }

  activated() {
    this.startVideo();
  }

  public startVideo() {
    setTimeout(() => {
      [...document.getElementsByTagName('video')].forEach(element => {
        element.play();
      });
    }, 100);
  }
}
</script>

<style lang="scss" scoped></style>
