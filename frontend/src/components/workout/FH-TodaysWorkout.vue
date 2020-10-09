<template>
  <div
    class="fh-todays-workout"
    v-if="$store.getters.valid"
    :class="{ 'fh-todays-workout__spaceing': spaceing }"
  >
    <div class="head" v-if="!onlyPreview">
      <div class="button-container">
        <div class="button" v-if="inAdvance" @click="prev">
          <i class="ti-chevron-left"></i>
        </div>
      </div>
      <div class="center">
        <div class="title">Trainingsplan</div>
        <div class="date-wrapper">
          <transition :name="transName">
            <div class="date" :key="dateLong">{{ dateLong }}</div>
          </transition>
        </div>
      </div>
      <div class="button-container">
        <div class="button" @click="next">
          <i class="ti-chevron-right"></i>
        </div>
      </div>
    </div>
    <div class="head" v-else>
      <div></div>
      <div class="center">
        <div class="title">{{ day }}</div>
      </div>
    </div>
    <tc-divider :dark="$store.getters.darkmode" />

    <div class="workout-preview">
      <div class="nothing" v-if="!today">
        <div>Für {{ day || dateLong }} stehen keine Übungen an</div>
        <tc-link tfcolor="success" @click="editDay">
          Übung / Workout hinzufügen
        </tc-link>
      </div>
      <div class="today" v-else>
        <tc-revealer :dark="$store.getters.darkmode">
          <div class="amount" slot="head">
            <div>
              <span>{{ todaysWorkout.length }}</span>
              Übung{{ todaysWorkout.length !== 1 ? 'en' : '' }}
            </div>
            <div>
              <tc-button
                :disabled="$store.getters.loading"
                icon="pencil"
                tfbackground="success"
                variant="filled"
                @click.stop="editDay"
              />
              <tc-button
                :disabled="$store.getters.loading"
                icon="cross"
                tfbackground="error"
                variant="filled"
                @click.stop="removeDay"
              />
            </div>
          </div>
          <ol>
            <li v-for="e in todaysWorkout" :key="e._id">{{ e.title }}</li>
          </ol>
        </tc-revealer>
        <tl-grid minWidth="100">
          <tc-button
            tfbackground="success"
            variant="filled"
            icon="gym"
            name="Workout starten"
            @click="startToday"
          />
        </tl-grid>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { aDay, days, months } from '@/utils/constants';
import { EventBus } from '@/utils/eventbus';
import {
  IExercise,
  IExerciseShowcase,
  ITrainingplanFull
} from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHTodaysWorkout extends Vue {
  @Prop({ default: true }) spaceing!: boolean;
  @Prop({ default: false }) onlyPreview!: boolean;
  @Prop({ default: 0 }) offset!: number;
  @Prop() day!: string;

  public inAdvance = this.offset;
  public transName = 'datename';

  public next() {
    this.transName = 'datenamex';
    this.inAdvance++;
  }

  public prev() {
    this.transName = 'datename';
    this.inAdvance = Math.max(0, --this.inAdvance);
  }

  get trainingplan(): ITrainingplanFull | null {
    return this.$store.getters.trainingplan;
  }

  get date(): Date {
    return new Date(new Date().getTime() + this.inAdvance * aDay);
  }

  get dateLong(): string {
    if (this.inAdvance === 0) return 'Heute';
    if (this.inAdvance === 1) return 'Morgen';
    if (this.inAdvance === 2) return 'Übermorgen';
    let date = days[this.date.getDay()].substring(0, 2);
    date += ', ' + this.date.getDate() + '. ';
    date += months[this.date.getMonth()].substring(0, 3);
    return date + ' ' + this.date.getFullYear();
  }

  get today(): boolean {
    if (!this.trainingplan) return false;
    return Object.keys(this.trainingplan).includes(this.index + '');
  }

  get todaysWorkout(): IExercise[] {
    if (!this.today) return [];
    // eslint-disable-next-line
    return (this.trainingplan as any)['' + this.index].exercises;
  }

  get index(): number {
    if (this.day) return days.indexOf(this.day);
    return this.date.getDay();
  }

  public editDay(): void {
    EventBus.$emit('edit-trainingplan', this.index);
  }

  public removeDay(): void {
    if (!this.$store.getters.loading) {
      axios.delete('trainingplan/' + this.index).then(res => {
        this.$store.commit('setTrainingplan', res.data);
      });
    }
  }

  public startToday(): void {
    const mapped = this.todaysWorkout.map(x => {
      return {
        _id: x._id,
        title: x.title,
        thumbnail: x.thumbnail,
        type: x.distance ? 'distance' : x.sets ? 'gym' : 'time'
      } as IExerciseShowcase;
    });
    EventBus.$emit('modal-start-workout', mapped);
  }
}
</script>

<style lang="scss" scoped>
.fh-todays-workout {
  &.fh-todays-workout__spaceing {
    margin-top: 20px;
  }
  padding: 20px;
  border-radius: $border-radius;
  background: $paragraph;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }

  .workout-preview {
    margin-top: 17px;
    .nothing {
      text-align: center;
      font-weight: 500;
      div {
        margin-bottom: 5px;
      }
    }
    .button {
      text-align: center;
      margin-top: 20px;
    }
    .today {
      .amount {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        font-weight: 500;
        span {
          margin-bottom: -5px;
          font-size: 2em;
          margin-right: 5px;
          font-weight: bold;
          opacity: 0.75;
        }
      }
      ol {
        margin-bottom: 0;
        padding-left: 30px;
        li {
          list-style-type: decimal-leading-zero;
          padding-left: 5px;
        }
      }
    }
  }

  .head {
    margin: 0 -20px;
    display: grid;
    grid-template-columns: 60px 1fr 60px;
    .button-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      &:first-child {
        padding-left: 20px;
      }
      &:last-child {
        padding-right: 20px;
        justify-content: flex-end;
      }
    }
    .center {
      .title {
        text-align: center;
        font-size: 1.3em;
        font-weight: bold;
      }
      .date-wrapper {
        height: 22px;
        text-align: center;
        opacity: 0.6;
        font-weight: 600;
        position: relative;
        .date {
          bottom: 0;
          text-align: center;
          width: 100%;
          position: absolute;
        }
      }
    }
  }
}
.datenamex-enter-active,
.datenamex-leave-active,
.datename-enter-active,
.datename-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.datenamex-enter,
.datenamex-leave-to,
.datename-enter,
.datename-leave-to {
  opacity: 0;
}
.datename-enter,
.datenamex-leave-to {
  transform: translateX(-50px);
}
.datename-leave-to,
.datenamex-enter {
  transform: translateX(+50px);
}
</style>
