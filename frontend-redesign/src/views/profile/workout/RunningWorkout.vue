<template>
  <div class="view-running-workout" v-if="dataLoaded">
    <FHAppear>
      <div :key="index">
        <tc-hero :key="index" :dark="$store.getters.darkmode">
          <img :src="exercises[index].thumbnail" slot="background" />
        </tc-hero>
      </div>
    </FHAppear>
    <div class="index">
      <span>{{ index + 1 }}</span>
      <span>/</span>
      <span>{{ exercises.length }}</span>
    </div>
    <div max-width content>
      <div class="timer-wrapper">
        <transition-group class="timer" name="timer">
          <div v-for="(t, i) in time" :key="t + '_' + i" :sep="t === ':'">
            {{ t }}
          </div>
        </transition-group>
      </div>

      <FHAppear>
        <div :key="index" class="sets-reps" v-if="type === 'gym'">
          <div class="timer-wrapper ex">
            <transition-group class="timer" name="timer">
              <div v-for="(t, i) in timeEx" :key="t + '_' + i" :sep="t === ':'">
                {{ t }}
              </div>
            </transition-group>
          </div>

          <tc-table :dark="$store.getters.darkmode">
            <tc-tr key="aa">
              <tc-th>Satz</tc-th>
              <tc-th>Wiederholungen</tc-th>
              <tc-th>Gewicht</tc-th>
            </tc-tr>
            <tc-tr v-for="(_x, i) in stats[index].reps" :key="i">
              <tc-td>#{{ i + 1 }}</tc-td>
              <tc-td>{{ stats[index].reps[i] }}x</tc-td>
              <tc-td>{{ stats[index].weights[i] }} kg</tc-td>
            </tc-tr>
          </tc-table>

          <div class="grid">
            <tc-input
              title="Reps"
              type="number"
              :dark="$store.getters.darkmode"
              v-model="reps"
            />
            <tc-input
              title="Gewicht"
              type="number"
              :dark="$store.getters.darkmode"
              v-model="weight"
            />
            <tl-flow vertical="end">
              <tc-button
                icon="plus"
                tfbackground="success"
                variant="filled"
                @click="addWeightReps"
              />
            </tl-flow>
          </div>
        </div>

        <div :key="index" class="distance" v-else-if="type === 'distance'">
          <div class="timer-wrapper ex">
            <transition-group class="timer" name="timer">
              <div v-for="(t, i) in timeEx" :key="t + '_' + i" :sep="t === ':'">
                {{ t }}
              </div>
            </transition-group>
          </div>
          <h3>Offenes Ziel</h3>
          <tc-input
            v-model="stats[index].distance"
            :dark="$store.getters.darkmode"
          />
        </div>

        <div :key="index" class="time" v-else-if="type === 'time'">
          <div class="timer-wrapper ex">
            <transition-group class="timer" name="timer">
              <div v-for="(t, i) in timeEx" :key="t + '_' + i" :sep="t === ':'">
                {{ t }}
              </div>
            </transition-group>
          </div>

          <tl-flow horizontal="space-between">
            <h3>Offenes Zeitziel</h3>
            <div class="saved-time" v-if="stats[index].time > 0">
              <span>{{ getHMS(stats[index].time).join('') }}</span>
            </div>
          </tl-flow>

          <div class="grid">
            <tc-input
              type="number"
              v-model="exTime"
              :dark="$store.getters.darkmode"
            />
            <tc-select
              :dark="$store.getters.darkmode"
              tfbackground="success"
              placeholder="Einheit"
              @selectedItems="s => (exTimeUnit = s[0] || '')"
            >
              <tc-select-item title="Sekunden" />
              <tc-select-item title="Minuten" />
              <tc-select-item title="Stunden" />
            </tc-select>
            <tl-flow vertical="end">
              <tc-button
                icon="plus"
                tfbackground="success"
                variant="filled"
                @click="setTime"
              />
            </tl-flow>
          </div>
        </div>
      </FHAppear>

      <div class="action-wrapper">
        <div class="grid">
          <tc-button
            v-if="index === 0"
            icon="blocked"
            name="Workout beenden"
            variant="opaque"
            tfbackground="error"
            @click="cancel"
          />
          <tc-button
            v-else
            icon="chevron-left"
            name="vorherige Übung"
            variant="opaque"
            tfbackground="alarm"
            @click="prev"
          />
          <tc-button
            v-if="index < exercises.length - 1"
            iconPosition="right"
            icon="chevron-right"
            name="nächste Übung"
            variant="opaque"
            tfbackground="alarm"
            @click="next"
          />
          <tc-button
            v-else
            name="Workout speichern"
            variant="opaque"
            tfbackground="success"
            @click="save"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import { aMinute, anHour, aSecond } from '@/utils/constants';
import { closeFullscreen } from '@/utils/functions';
import { IExerciseInfo } from '@/utils/interfaces';
import { WorkoutManagement, WorkoutStats } from '@/utils/WorkoutManagement';
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear
  }
})
export default class RunningWorkout extends Vue {
  public startTime = 0;
  public exercises: IExerciseInfo[] = [];
  public stats: WorkoutStats[] = [];
  public index = 0;
  public time: (string | number)[] = [0, 0, ':', 0, 0, ':', 0, 0];
  public timeEx: (string | number)[] = [0, 0, ':', 0, 0, ':', 0, 0];
  public timer = 0;

  public reps = 0;
  public weight = 0;
  public exTime = 0;
  public exTimeUnit = '';

  created() {
    if (!WorkoutManagement.hasActiveWorkout()) {
      closeFullscreen('workouts');
    }
  }

  mounted() {
    this.exercises = WorkoutManagement.getExercises();
    this.startTime = WorkoutManagement.getStartTime();
    this.stats = WorkoutManagement.getStats();
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
    this.indexChanged(0, undefined);
  }

  beforeDestroy() {
    clearInterval(this.timer);
  }

  public getHMS(ms: number): string[] {
    return [
      ...('0' + Math.floor((ms / anHour) % 24) + ':').slice(-3).split(''),
      ...('0' + Math.floor((ms / aMinute) % 60) + ':').slice(-3).split(''),
      ...('0' + Math.floor((ms / aSecond) % 60)).slice(-2).split('')
    ];
  }

  public updateTime() {
    this.time = this.getHMS(new Date().getTime() - this.startTime);

    const stat = this.stats[this.index];
    if (stat) {
      this.timeEx = this.getHMS(
        new Date().getTime() - stat.start + stat.duration
      );
    }
  }

  get dataLoaded(): boolean {
    return (
      this.exercises &&
      this.exercises.length > 0 &&
      this.startTime > 0 &&
      this.stats &&
      this.stats.length > 0
    );
  }

  get type(): 'gym' | 'distance' | 'time' {
    return this.exercises[this.index].type;
  }

  @Watch('index', { immediate: true })
  indexChanged(to: number | undefined, from: number | undefined): void {
    if (!this.stats || this.stats.length === 0) return;

    if (to !== undefined) {
      const statTo = this.stats[to];
      if (statTo.start === -1) {
        statTo.start = new Date().getTime();
      }
    }
    if (from !== undefined) {
      const statFrom = this.stats[from];
      statFrom.duration += new Date().getTime() - statFrom.start;
      statFrom.start = -1;
    }

    WorkoutManagement.saveStats(this.stats);
    this.updateTime();
  }

  public addWeightReps(): void {
    if (this.weight && this.reps) {
      if (this.weight > 0 && this.reps > 0) {
        this.stats[this.index].reps.push(this.reps);
        this.stats[this.index].weights.push(this.weight);

        WorkoutManagement.saveStats(this.stats);
      }
    }
  }

  public setTime(): void {
    if (this.exTime && this.exTimeUnit) {
      if (this.exTime > 0 && this.exTimeUnit.length > 0) {
        switch (this.exTimeUnit) {
          case 'Stunden':
            this.exTime *= anHour;
            break;
          case 'Minuten':
            this.exTime *= aMinute;
            break;
          default:
            this.exTime *= aSecond;
            break;
        }
        if (this.exTime > 0) {
          this.stats[this.index].time = this.exTime;
          WorkoutManagement.saveStats(this.stats);
        }
        this.exTime = 0;
      }
    }
  }

  public cancel(): void {
    WorkoutManagement.clearActiveWorkout();
  }

  public next(): void {
    this.index = Math.min(this.exercises.length, this.index + 1);
  }

  public prev(): void {
    this.index = Math.max(0, this.index - 1);
  }

  public save(): void {
    clearInterval(this.timer);
    WorkoutManagement.saveWorkout(this.stats);
  }
}
</script>

<style lang="scss" scoped>
.view-running-workout {
  min-height: 100vh;

  [content] {
    padding-top: 20px;
    padding-bottom: calc(70px + env(safe-area-inset-bottom));
  }

  .index {
    // margin-top: -50px;
    position: absolute;
    right: 0;
    transform: translateY(-100%);
    color: #fff;
    @include backdrop-blur($success);
    padding: 5px 5vw 5px 20px;
    border-radius: 15px 0 0;

    span {
      font-size: 1.4em;
      font-weight: 800;
      &:first-child {
        font-weight: bold;
        opacity: 0.6;
        font-size: 1.2em;
      }
    }
  }

  .timer-wrapper {
    padding: 5px;
    margin-bottom: 20px;
    border-radius: $border-radius;
    background: $color_dark;
    @media #{$isDark} {
      background: $color;
    }
    .timer {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      div {
        font-weight: 900;
        font-size: 2.6em;
        text-align: center;
        width: 28px;

        &:nth-child(3n) {
          color: $success;
        }

        &[sep] {
          width: 20px;
        }
      }
    }
    &.ex {
      opacity: 0.75;
      width: fit-content;
      padding: 5px 10px;
      margin-left: auto;
      .timer {
        div {
          font-size: 18px;
          width: 12px;

          &[sep] {
            width: 10px;
          }
        }
      }
    }
  }

  .action-wrapper {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 0 5vw env(safe-area-inset-bottom);
    height: 50px;

    @include backdrop-blur($color_dark);
    @media #{$isDark} {
      @include backdrop-blur($color);
    }

    display: flex;
    justify-content: center;
    align-items: center;
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 0;
    }
  }

  .sets-reps {
    .tc-table-2 {
      margin-bottom: 20px;
      .tc-td {
        padding: 10px;
      }
    }
    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
      grid-gap: 0;
    }
  }
  .time {
    .saved-time {
      font-weight: bold;
      opacity: 0.7;
    }
    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, auto) auto;
      grid-gap: 0;
    }
  }
}

.timer-enter-active {
  transition: all 0.5s ease-in-out;
}
.timer-leave-active {
  display: none;
}

.timer-enter {
  opacity: 0;
  transform: translateY(-10px) scale(0.7);
}
</style>
