<template>
  <div class="fh-exercise">
    <tc-magic-card
      v-if="ex"
      :src="ex.thumbnail"
      :dark="$store.getters.darkmode"
    >
      <div class="card-thumbnail" slot="thumbnail">
        <tl-flow flow="column" vertical="start">
          <div class="indicator" :diff="ex.difficulty">
            <i
              class="ti-circle"
              v-for="(i, j) in Array(+ex.difficulty)"
              :key="j"
            />
          </div>
          <div class="title">{{ ex.title }}</div>
        </tl-flow>
      </div>
      <div
        class="add-to-workout"
        v-if="$store.getters.valid && !isInATWModal"
        slot="thumbnail"
      >
        <tc-button
          :disabled="$store.getters.loading"
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
          <div
            class="muscle"
            v-for="m in ex.affectedMuscles"
            :key="m"
            @click="showTrainingsFor(m)"
          >
            {{ m }}
          </div>
        </div>
        <h3>Volumen</h3>
        <template v-if="ex.reps">
          <ul>
            <li>Sätze: {{ ex.sets }}</li>
            <li>Wiederholungen: {{ ex.reps }}</li>
          </ul>
        </template>
        <template v-else-if="ex.distance">
          <ul>
            <li>Strecke: {{ ex.distance }}</li>
          </ul>
        </template>
        <template v-else-if="ex.time">
          <ul>
            <li>Dauer: {{ time }}</li>
          </ul>
        </template>
        <template v-if="ex.warnings.length > 0">
          <h3>Hinweise</h3>
          <ul>
            <li v-for="h in ex.warnings" :key="h">{{ h }}</li>
          </ul>
        </template>

        <template v-if="ex.steps.length > 0">
          <h3>Ausführung</h3>
          <tc-steps
            :dark="$store.getters.darkmode"
            direction="column"
            :current="99"
          >
            <tc-step-item v-for="s in ex.steps" :key="s" :title="s" />
          </tc-steps>
        </template>

        <tl-grid edit v-if="isAuthor">
          <tc-button
            :disabled="$store.getters.loading"
            variant="filled"
            tfbackground="success"
            name="Übung bearbeiten"
            icon="tools"
            :to="{ name: 'editExercise', params: { id: ex._id } }"
          />
        </tl-grid>
      </div>
    </tc-magic-card>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHExercise extends Vue {
  @Prop() exercise!: IExercise;
  @Prop({ default: false }) isInATWModal!: boolean;
  @Prop() id!: string;

  public ex: IExercise = this.exercise || null;

  async mounted() {
    if (!this.ex && this.id) {
      const { data } = await axios.get('exercise/' + this.id);
      this.ex = data;
      this.$forceUpdate();
    }
  }

  get time(): string {
    if (this.ex) {
      const time = this.ex.time || 0;
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
      this.ex.author === this.$store.getters.user._id &&
      this.ex.reviewed &&
      !this.isInATWModal
    );
  }

  public showTrainingsFor(muscle: string) {
    this.$router.push({ name: 'training-muscle', params: { muscle: muscle } });
  }

  public addToWorkout(): void {
    EventBus.$emit('add-to-workout', this.ex);
  }
}
</script>

<style lang="scss" scoped>
.fh-exercise {
  .card-content {
    padding: 0 5vw;
    .muscles {
      margin: 0 -3px;
      .muscle {
        padding: 2.5px 12.5px;
        box-sizing: border-box;
        border: 2px solid rgba($color, 0.25);
        &:hover {
          background: $color;
          color: $color_dark;
        }
        @media (prefers-color-scheme: dark) {
          border-color: rgba($color_dark, 0.5);
          &:hover {
            background: $color_dark;
            color: $color;
          }
        }
        border-radius: $border-radius;
        display: inline-block;
        margin: 3px;
        cursor: pointer;
        transition: 0.2s ease-in-out;
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
