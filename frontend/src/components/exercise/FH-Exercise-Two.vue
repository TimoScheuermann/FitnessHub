<template>
  <tc-magic-card
    class="fh-exercise-two"
    :dark="$store.getters.darkmode"
    :maxHeight="$store.getters.valid ? 300 : 250"
  >
    <div
      class="magic-card-thumbnail"
      :style="{ 'background-image': 'url(' + exercise.thumbnail + ')' }"
      slot="thumbnail"
    >
      <div class="preview" />
      <fh-difficulty :difficulty="exercise.difficulty" />
      <tl-grid class="container" minWidth="200" gap="0">
        <div class="title">{{ exercise.title }}</div>
        <tl-grid
          v-if="$store.getters.valid"
          minWidth="50"
          gap="0"
          class="actions"
        >
          <tc-button
            background="white"
            color="#111"
            icon="plus"
            name="Workout"
            @click.stop="addToWorkout"
          />
          <tc-button
            background="white"
            color="#111"
            icon="list"
            name="Liste"
            @click.stop="addToList"
          />
        </tl-grid>
      </tl-grid>
    </div>

    <div class="card-content">
      <fh-pd-exercise :exercise="exercise" />
    </div>
  </tc-magic-card>
</template>

<script lang="ts">
import { EventBus } from '@/utils/eventbus';
import { IExercise, IExerciseShowcase } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHDifficulty from '../common/FH-Difficulty.vue';
import FHPropertyDetailsExercise from '../propertyDetails/FH-PD-Exercise.vue';

@Component({
  components: {
    'fh-difficulty': FHDifficulty,
    'fh-pd-exercise': FHPropertyDetailsExercise
  }
})
export default class FHExerciseTwo extends Vue {
  @Prop() exercise!: IExercise;

  public addToWorkout(): void {
    if (this.exercise) {
      EventBus.$emit('modals-close');
      EventBus.$emit('modal-add-to-workout', this.exercise);
    }
  }
  public addToList(): void {
    if (this.exercise) {
      EventBus.$emit('modal-exercise-list', {
        _id: this.exercise._id,
        title: this.exercise.title,
        thumbnail: this.exercise.thumbnail,
        type: this.exercise.distance
          ? 'distance'
          : this.exercise.sets
          ? 'gym'
          : 'time'
      } as IExerciseShowcase);
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-exercise-two {
  .magic-card-thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .fh-difficulty {
      position: absolute;
      top: 20px;
      left: 20px;
    }
    .preview,
    .container {
      background-image: inherit;
      background-size: cover;
    }
    .preview {
      flex-grow: 1;
    }
    .container {
      position: relative;
      overflow: hidden;
      padding: 20px;
      @include backdrop-blur(#111);

      .title {
        position: relative;
        font-weight: 800;
        font-size: 1.5em;
        display: grid;
        place-content: center start;
      }
      .actions {
        position: relative;
        margin-top: 10px;
      }
    }
  }

  .exercise-details {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    display: grid;
    grid-template-rows: 1fr auto;

    .container {
      position: relative;
      .background {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .content {
        @include backdrop-blur(#111);
        position: relative;
        padding: 20px;
        .title {
          margin-top: 10px;
          font-weight: 800;
          font-size: 1.5em;
        }
        .actions {
          margin-top: 10px;
        }
      }
    }
  }
  .card-content {
    padding: 0 5vw;
  }
}
</style>
