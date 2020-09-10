<template>
  <div class="fh-stopwatch">
    <div class="fh-stopwatch--display">
      <div v-for="(l, i) in display" :key="i">{{ l }}</div>
    </div>
    <div class="fh-stopwatch--buttons">
      <tc-button
        :disabled="state === 0"
        name="Stopp"
        tfbackground="error"
        variant="opaque"
        @click="stop"
      />
      <tc-button
        v-if="state === 0"
        name="Start"
        tfbackground="success"
        variant="opaque"
        @click="start"
      />
      <tc-button
        v-if="state === 1"
        name="Pause"
        background="#e67e22"
        variant="opaque"
        @click="pause"
      />
      <tc-button
        v-if="state === 2"
        name="Weiter"
        tfbackground="success"
        variant="opaque"
        @click="resume"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { aHour, aMinute, aSecond } from '@/utils/constants';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHStopwatch extends Vue {
  public state = 0;
  public timestamp = 0;
  public stopwatch = 0;
  public display = '00:00,00';
  public previousTime = 0;

  destroyed() {
    this.stop();
  }

  public start() {
    this.timestamp = new Date().getTime();
    this.run();
  }

  public stop() {
    this.pause();
    this.state = 0;
    this.display = '00:00,00';
    this.previousTime = 0;
  }

  public pause() {
    clearInterval(this.stopwatch);
    this.stopwatch = 0;
    this.state = 2;
    this.previousTime = new Date().getTime() - this.timestamp;
  }

  public resume() {
    this.timestamp = new Date().getTime() - this.previousTime;
    this.run();
  }

  public run() {
    this.state = 1;
    this.stopwatch = setInterval(() => {
      const now = new Date().getTime();
      const dif = now - this.timestamp;
      const hours = Math.floor(dif / aHour);
      const minutes = Math.floor((dif - hours * aHour) / aMinute);
      const seconds = Math.floor(
        (dif - hours * aHour - minutes * aMinute) / aSecond
      );
      const milliseconds = dif % 1000;

      let display = '';
      if (hours > 0) {
        display += (hours < 10 ? '0' : '') + hours + ':';
      }
      display += (minutes < 10 ? '0' : '') + minutes + ':';
      display += (seconds < 10 ? '0' : '') + seconds + ',';
      display += (milliseconds + '00').substring(0, 2);
      this.display = display;
    }, 10);
  }
}
</script>

<style lang="scss" scoped>
.fh-stopwatch {
  text-align: center;
  margin-top: 20px;
  .fh-stopwatch--display {
    font-size: 3em;
    font-weight: 700;
    display: inline-flex;
    div {
      width: 32px;
      text-align: center;
      &:nth-child(3n) {
        width: 15px;
      }
    }
  }
  .fh-stopwatch--buttons {
    margin-top: 10px;
    .tc-button {
      width: 100px;
    }
  }
}
</style>
