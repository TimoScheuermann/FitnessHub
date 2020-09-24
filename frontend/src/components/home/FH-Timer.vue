<template>
  <div class="fh-timer">
    <div class="fh-timer--display">
      <tc-progress
        type="ring"
        tfcolor="success"
        :percent="percentage"
        :ringSize="220"
        :ringWidth="12"
        :dark="$store.getters.darkmode"
      />
      <div class="fh-timer--inputs">
        <input
          type="number"
          inputmode="numeric"
          min="0"
          :disabled="state !== 0"
          @input="changeMinutes"
          v-model="minutes"
        />
        <div>:</div>
        <input
          type="number"
          inputmode="numeric"
          min="0"
          :disabled="state !== 0"
          @input="changeSeconds"
          max="60"
          v-model="seconds"
        />
      </div>
    </div>
    <div class="fh-timer--buttons">
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
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHTimer extends Vue {
  public minutes: number | string = '00';
  public seconds: number | string = '30';
  public timer = 0;
  public goal = 0;
  public saved: number[] = [];
  public state = 0; // 0 = stop (not running), 1 = running, 2 = paused
  public remaining = 0;
  public percentage = 100;

  destroyed() {
    this.stop();
  }

  public changeSeconds() {
    const numbers = (this.seconds + '0').split('');
    if (+numbers[0] > 6) {
      this.seconds = +(this.seconds + '').substring(0, 1);
    } else if (+numbers[0] === 6 && +numbers[1] > 0) {
      this.seconds = +(this.seconds + '').substring(0, 1);
    } else {
      this.seconds = +(this.seconds + '').substring(0, 2);
    }
  }

  public changeMinutes() {
    this.minutes = (this.minutes + '').substring(0, 3);
  }

  public start() {
    this.saved = [+this.minutes, +this.seconds];
    this.goal =
      new Date().getTime() + (+this.minutes * 60 + +this.seconds) * 1000;
    this.run();
  }

  public stop() {
    this.minutes = this.saved[0];
    this.seconds = this.saved[1];
    this.pause();
    this.state = 0;
    this.saved = [];
    if (this.seconds <= 9) this.seconds = '0' + this.seconds;
    if (this.minutes <= 9) this.minutes = '0' + this.minutes;
    this.percentage = 100;
  }

  public pause() {
    clearInterval(this.timer);
    this.timer = 0;
    this.state = 2;
    this.remaining = this.goal - new Date().getTime();
  }

  public resume() {
    this.goal = new Date().getTime() + this.remaining;
    this.run();
  }

  public run() {
    this.state = 1;
    this.timer = setInterval(() => {
      const remaining = new Date().getTime() - this.goal;
      if (remaining < 0) {
        const totalSeconds = Math.abs(Math.floor(remaining / 1000));
        this.percentage =
          (totalSeconds / (this.saved[0] * 60 + this.saved[1])) * 100;
        this.seconds = totalSeconds % 60;
        this.minutes = Math.floor(totalSeconds / 60);
        if (this.seconds <= 9) this.seconds = '0' + this.seconds;
        if (this.minutes <= 9) this.minutes = '0' + this.minutes;
      } else {
        this.stop();
      }
    }, 10);
  }
}
</script>

<style lang="scss" scoped>
.fh-timer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  .fh-timer--display {
    position: relative;
    .fh-timer--inputs {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: center;
      align-items: center;
      div {
        font-size: 3em;
        font-weight: 500;
        margin-bottom: 8px;
      }
      input {
        &:first-child {
          text-align: right;
        }
        font: inherit;
        color: inherit;
        border: none;
        outline: none;
        background: none;
        width: 100px;
        font-size: 3em;
        font-weight: 700;
        padding: 0;
        margin: 0;
        -webkit-appearance: none;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        -moz-appearance: textfield;
      }
    }
  }
  .fh-timer--buttons {
    margin-top: 10px;
    .tc-button {
      width: 100px;
    }
  }
}
</style>
