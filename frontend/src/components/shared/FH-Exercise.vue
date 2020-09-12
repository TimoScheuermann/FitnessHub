<template>
  <div class="fh-exercise" v-if="exercise">
    <tc-magic-card :src="exercise.thumbnail" :dark="$store.getters.darkmode">
      <div class="card-thumbnail" slot="thumbnail">
        <tl-flow flow="column" vertical="start">
          <div class="indicator" :diff="exercise.difficulty">
            <i
              class="ti-circle"
              v-for="(i, j) in Array(+exercise.difficulty)"
              :key="j"
            />
          </div>
          <div class="title">{{ exercise.title }}</div>
        </tl-flow>
      </div>
      <div
        class="add-to-workout"
        v-if="$store.getters.valid && !isInATWModal"
        slot="thumbnail"
      >
        <tc-button
          variant="border"
          name="Workout"
          icon="plus"
          color="#000"
          background="#fff"
          @click.stop="addToWorkout"
        />
      </div>
      <div class="card-content">
        <h3>Betroffene Muskeln</h3>
        <div class="muscles">
          <div class="muscle" v-for="m in exercise.affectedMuscles" :key="m">
            {{ m }}
          </div>
        </div>
        <h3>Volumen</h3>
        <template v-if="exercise.reps">
          <ul>
            <li>Sätze: {{ exercise.sets }}</li>
            <li>Wiederholungen: {{ exercise.reps }}</li>
          </ul>
        </template>
        <template v-else-if="exercise.distance">
          <ul>
            <li>Strecke: {{ exercise.distance }}</li>
          </ul>
        </template>
        <template v-else-if="exercise.time">
          <ul>
            <li>Dauer: {{ time }}</li>
          </ul>
        </template>
        <template v-if="exercise.warnings.length > 0">
          <h3>Hinweise</h3>
          <ul>
            <li v-for="h in exercise.warnings" :key="h">{{ h }}</li>
          </ul>
        </template>

        <template v-if="exercise.steps.length > 0">
          <h3>Ausführung</h3>
          <tc-steps
            :dark="$store.getters.darkmode"
            direction="column"
            :current="99"
          >
            <tc-step-item v-for="s in exercise.steps" :key="s" :title="s" />
          </tc-steps>
        </template>

        <tl-grid edit v-if="isAuthor">
          <tc-button
            variant="filled"
            tfbackground="success"
            name="Übung bearbeiten"
            icon="tools"
            :to="{ name: 'editExercise', params: { id: exercise._id } }"
          />
        </tl-grid>
      </div>
    </tc-magic-card>
  </div>
</template>

<script lang="ts">
import { EventBus } from '@/utils/eventbus';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHExercise extends Vue {
  @Prop() exercise!: IExercise;
  @Prop({ default: false }) isInATWModal!: boolean;

  get time(): string {
    if (this.exercise) {
      const time = this.exercise.time || 0;
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor(time / 60) - hours * 60;
      const seconds = time % 60;

      const times = [];
      if (hours > 0) times.push(hours + 'h');
      if (minutes > 0) times.push(minutes + 'm');
      if (seconds > 0) times.push(seconds + 's');
      return times.join(' ');
    }
    return '';
  }

  get isAuthor(): boolean {
    return (
      this.$store.getters.valid &&
      this.exercise.author === this.$store.getters.user._id &&
      this.exercise.reviewed &&
      !this.isInATWModal
    );
  }

  public addToWorkout(): void {
    EventBus.$emit('add-to-workout', this.exercise);
  }
}
</script>

<style lang="scss" scoped>
.fh-exercise {
  // position: absolute;
  .card-content {
    padding: 0 5vw;
    .muscles {
      margin: 0 -3px;
      .muscle {
        padding: 2.5px 12.5px;
        box-sizing: border-box;
        border: 2px solid rgba($color, 0.25);
        @media (prefers-color-scheme: dark) {
          border-color: rgba($color_dark, 0.5);
        }
        border-radius: $border-radius;
        display: inline-block;
        margin: 3px;
      }
    }
  }
  .tc-magic-card /deep/ {
    .description,
    i {
      color: #fff;
    }
    img {
      filter: brightness(50%);
    }
  }
  .tl-grid[edit] {
    margin-bottom: 20px;
  }
  .add-to-workout {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 7px;
    .tc-button /deep/ i {
      color: inherit;
    }
  }
  .card-thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px;
    position: flex;
    flex-direction: column;

    .title {
      margin: 5px 0;
      font-weight: 500;
      font-size: 1.3em;
      color: #fff;
    }
    .indicator {
      &[diff='1'] {
        color: $success;
      }
      &[diff='2'] {
        color: $alarm;
      }
      &[diff='3'] {
        color: $error;
      }
      i {
        color: inherit;
        margin-right: 5px;
      }
    }
  }
}
</style>
