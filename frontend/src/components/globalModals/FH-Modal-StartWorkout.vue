<template>
  <!-- :value="true" -->
  <tc-modal
    :closable="false"
    v-model="modalOpened"
    :dark="$store.getters.darkmode"
    class="fh-modal-start-workout"
  >
    <tl-grid class="modal-head" minWidth="100">
      <div class="container">
        <div class="m-title">Zeit</div>
        <div class="time">{{ totalTime }}</div>
      </div>
      <div class="container">
        <div class="m-title">Bevorstehend</div>
        <fh-carousel>
          <tc-avatar
            v-for="(t, i) in upcommingThumbnails"
            :key="i"
            size="tiny"
            border="rounded"
            :src="t"
            alt=""
          />
        </fh-carousel>
      </div>
    </tl-grid>

    <template v-if="current">
      <tl-flow class="m-title" horizontal="space-between">
        <div>Aktuelle Übung</div>
        <div>{{ currentTime }}</div>
      </tl-flow>
      <fh-showcase
        :title="current.title.split(' (')[0]"
        :src="current.thumbnail"
      />

      <tc-table :dark="$store.getters.darkmode">
        <tc-tr v-for="(s, i) in store[currentExercise].data" :key="i">
          <tc-td class="set">{{ i + 1 }}</tc-td>
          <tc-td v-if="current.type === 'gym'">
            <div class="reps">{{ s.reps }} <span>x</span> {{ s.weight }}kg</div>
          </tc-td>
          <tc-td v-else-if="current.type === 'distance'">
            <div class="reps">{{ s.distance }}m</div>
          </tc-td>
          <tc-td v-else>
            <div class="reps">{{ s.minutes }}m {{ s.seconds }}s</div>
          </tc-td>
          <tc-td class="button">
            <tc-button
              icon="cross"
              variant="filled"
              tfbackground="error"
              @click="removeIndex(i)"
            />
          </tc-td>
        </tc-tr>
      </tc-table>
      <div class="input-grid">
        <template v-if="current.type === 'gym'">
          <tc-input
            :dark="$store.getters.darkmode"
            type="number"
            :buttons="true"
            title="Wiederholungen"
            v-model="repsInput"
          />
          <tc-input
            :dark="$store.getters.darkmode"
            type="number"
            :buttons="true"
            title="Gewicht"
            v-model="weightInput"
          />
        </template>
        <template v-else-if="current.type === 'distance'">
          <tc-input
            :dark="$store.getters.darkmode"
            type="number"
            :buttons="true"
            title="Strecke"
            v-model="distanceInput"
            span
          />
        </template>
        <template v-else>
          <tc-input
            :dark="$store.getters.darkmode"
            type="number"
            :buttons="true"
            title="Minuten"
            v-model="minutesInput"
          />
          <tc-input
            :dark="$store.getters.darkmode"
            type="number"
            :buttons="true"
            title="Sekunden"
            v-model="secondsInput"
          />
        </template>
        <tl-flow vertical="end">
          <tc-button
            icon="plus"
            variant="filled"
            @click="save(false)"
            :disabled="!current"
          />
        </tl-flow>
      </div>
    </template>
    <div class="bars" :style="'--total:' + totalExercises">
      <div
        class="bar"
        v-for="(a, i) in Array(totalExercises)"
        :key="i"
        :class="{
          active: i === currentExercise,
          done: i < currentExercise
        }"
      />
    </div>
    <tl-grid minWidth="100" gap="0 20" slot="footer">
      <tc-button
        v-if="currentExercise !== 0"
        name="Vorherige Übung"
        tfbackground="error"
        icon="chevron-left"
        variant="filled"
        @click="prev"
      />
      <tc-button
        v-else
        name="Abbrechen"
        tfbackground="error"
        icon="trashcan-alt"
        variant="filled"
        @click="cancel"
      />
      <tc-button
        v-if="currentExercise !== totalExercises - 1"
        name="Nächste Übung"
        tfbackground="success"
        icon="chevron-right"
        iconPosition="right"
        variant="filled"
        @click="next"
      />
      <tc-button
        v-else
        name="Workout beenden"
        tfbackground="orange"
        icon="trophy"
        variant="filled"
        @click="finish"
      />
    </tl-grid>
  </tc-modal>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { FinishExerciseDTO } from '@/utils/dtos';
import { EventBus } from '@/utils/eventbus';
import { IExercise, IExerciseShowcase } from '@/utils/interfaces';
import { Component, Vue } from 'vue-property-decorator';
import FHShowcase from '../common/FH-Showcase.vue';

interface IStoreDistance {
  distance: number;
}
interface IStoreTime {
  minutes: number;
  seconds: number;
}
interface IStoreGym {
  reps: number;
  weight: number;
}
interface IStoreUnit {
  data: (IStoreDistance | IStoreTime | IStoreGym)[];
  start: number;
  time: number;
}

@Component({
  components: {
    'fh-showcase': FHShowcase
  }
})
export default class FHModalStartWorkout extends Vue {
  public modalOpened = false;
  public currentExercise = 4;
  public totalExercises = 10;
  public exercises: IExerciseShowcase[] | null = null;
  public store: IStoreUnit[] = [];
  public distanceInput = 0;
  public minutesInput = 0;
  public secondsInput = 0;
  public repsInput = 0;
  public weightInput = 0;
  public startTime = 0;
  public timer = 0;
  public totalTime = '';
  public currentTime = '';

  mounted() {
    EventBus.$on('modal-start-workout', this.open);
    EventBus.$on('modal-start-workout-returning', this.loadExistingData);
  }

  beforeDestroy() {
    this.stopTimer();
  }

  public stopTimer(): void {
    clearInterval(this.timer);
  }

  public open(exercises: IExerciseShowcase[]): void {
    // dont open, unless at least one exercise is in the list
    if (!exercises || exercises.length === 0) return;

    // reset modal
    this.exercises = exercises;
    this.currentExercise = 0;
    this.totalExercises = this.exercises.length;
    this.startTime = new Date().getTime();

    // insert placeholder stats to local store
    this.store = Array.from({ length: this.totalExercises }, (_x, i) => {
      return {
        data: [],
        time: 0,
        start: i === 0 ? this.startTime : 0
      };
    });

    this.loadExistingData();

    // start timer, to evaluate time for every single exercise in local store
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      this.totalTime = this.transformTime((now - this.startTime) / 1000);
      const c = this.store[this.currentExercise];
      const t = now - c.start + c.time;
      this.currentTime = this.transformTime(t / 1000);
    }, 200);

    // save data ONLY to local storage
    this.save(true);

    // open modal to user
    this.modalOpened = true;
  }

  // transforms seconds to minutes and seconds
  public transformTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const mm = (m < 10 ? '0' : '') + m;
    const ss = (s < 10 ? '0' : '') + s;
    return `${mm}:${ss}`;
  }

  // returns thumbnail of upcoming exercises
  get upcommingThumbnails(): string[] {
    return (this.exercises || [])
      .filter((x, i) => i > this.currentExercise)
      .map(x => x.thumbnail);
  }

  // returns current exercise if exists
  get current(): IExerciseShowcase | null {
    if (!this.exercises) return null;
    if (this.exercises.length < this.currentExercise) return null;
    return this.exercises[this.currentExercise];
  }

  // load data stored in local storage
  public loadExistingData(fromEventBus = false) {
    const data = localStorage.getItem('fitnesshub-cw');
    if (data) {
      const json = JSON.parse(data);
      this.currentExercise = json.currentExercise;
      this.totalExercises = json.totalExercises;
      this.startTime = json.startTime;
      this.exercises = json.exercises;
      this.store = json.store;
      this.distanceInput = json.distanceInput;
      this.minutesInput = json.minutesInput;
      this.secondsInput = json.secondsInput;
      this.repsInput = json.repsInput;
      this.weightInput = json.weightInput;

      // open modal if called via eventbus (if app has been accidently closed during workout)
      if (fromEventBus) this.open(this.exercises || []);
    }
  }

  public save(onlyLS = false): void {
    if (!onlyLS && this.current) {
      // set reps and weight
      if (this.current.type === 'gym') {
        this.store[this.currentExercise].data.push({
          reps: +this.repsInput,
          weight: +this.weightInput
        } as IStoreGym);

        // set time
      } else if (this.current.type === 'time') {
        this.store[this.currentExercise].data.push({
          minutes: +this.minutesInput,
          seconds: +this.secondsInput
        } as IStoreTime);
        // set distance
      } else {
        this.store[this.currentExercise].data.push({
          distance: +this.distanceInput
        } as IStoreDistance);
      }
    }

    // save local store to local storage
    localStorage.setItem(
      'fitnesshub-cw',
      JSON.stringify({
        currentExercise: this.currentExercise,
        totalExercises: this.totalExercises,
        startTime: this.startTime,
        exercises: this.exercises,
        store: this.store,
        distanceInput: this.distanceInput,
        minutesInput: this.minutesInput,
        secondsInput: this.secondsInput,
        repsInput: this.repsInput,
        weightInput: this.weightInput
      })
    );
  }

  public removeIndex(index: number) {
    this.store[this.currentExercise].data = this.store[
      this.currentExercise
    ].data.filter((_x, i) => i !== index);
    this.save(true);
  }

  public next(): void {
    this.change(1);
  }

  public prev(): void {
    this.change(-1);
  }

  // save current time for current exercise
  public change(amount: number): void {
    const c = this.store[this.currentExercise];
    c.time += new Date().getTime() - c.start;
    c.start = 0;
    this.currentExercise += amount;
    const n = this.store[this.currentExercise];
    if (n.start === 0) n.start = new Date().getTime();
  }

  public async finish(): Promise<void> {
    // reset everything and send data to backend
    localStorage.removeItem('fitnesshub-cw');
    this.stopTimer();
    this.change(0);
    const data = this.getTransformedStoreToDTO();
    this.exercises = null;
    this.modalOpened = false;
    await axios.post('exercise/finished', data);
    axios.get('exercise/recent').then(res => {
      res.data.forEach((x: IExercise) =>
        this.$store.commit('addRecentExercise', x)
      );
    });

    axios.get('charts').then(res => {
      this.$store.commit('setWorkoutCharts', res.data);
    });
  }

  // reset
  public cancel(): void {
    localStorage.removeItem('fitnesshub-cw');
    this.stopTimer();
    this.exercises = null;
    this.modalOpened = false;
  }

  getTransformedStoreToDTO(): FinishExerciseDTO[] {
    // transform every exercise in the current workout
    return this.store
      .filter(x => x.data.length !== 0)
      .map((x, i) => {
        const exercise = (this.exercises || [])[i];
        const common = {
          exercise: exercise._id,
          start: this.startTime,
          duration: x.time
        } as FinishExerciseDTO;
        if (exercise.type === 'gym') {
          const data = x.data as IStoreGym[];
          common.setsReps = data.map(x => x.reps);
          common.setsWeights = data.map(x => x.weight);
        } else if (exercise.type === 'time') {
          const data = x.data as IStoreTime[];
          common.times = data.map(x => x.minutes * 60 + x.seconds);
        } else {
          const data = x.data as IStoreDistance[];
          common.distances = data.map(x => x.distance);
        }
        return common;
      })
      .filter(x => !!x);
  }
}
</script>

<style lang="scss" scoped>
.fh-modal-start-workout {
  &,
  * {
    user-select: none;
  }
  /deep/ .tc-modal--head__prestyled {
    display: none;
  }
  .m-title {
    font-weight: 700;
    user-select: none;
    text-transform: uppercase;
    font-size: 15px;
    opacity: 0.75;
  }
  .modal-head {
    user-select: none;
    margin: 5vw 0 10px;
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .time {
        font-weight: bold;
        font-size: 3em;
        margin-bottom: 5px;
      }
    }
  }
  .fh-showcase {
    margin: 5px 0 20px;
  }
  .tc-td {
    user-select: none;
    &.set {
      font-weight: bolder;
      font-size: 1.4em;
      padding: 10px 15px;
    }
    .reps {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 10px;
      font-weight: bold;
      font-size: 1.2em;
      span {
        line-height: 20px;
        margin: 0 5px;
        font-size: 16px;
      }
    }
    &.button {
      width: 32px;
    }
  }
  .input-grid {
    margin-top: 10px;
    user-select: none;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    /deep/ .indicator__button {
      min-width: 20px;
    }
    .tc-input[span] {
      grid-column: span 2;
    }
  }

  .bars {
    display: grid;
    grid-template-columns: repeat(var(--total), 1fr);
    grid-gap: 5px;
    margin: 20px 0 5px;
    .bar {
      height: 3px;
      border-radius: $border-radius;
      background: currentColor;
      opacity: 0.5;
      &.active,
      &.done {
        opacity: 1;
      }
      &.active {
        background: $success;
      }
    }
  }
}
</style>
