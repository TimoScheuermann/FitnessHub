<template>
  <tc-magic-card
    class="fh-exercise-two"
    :dark="$store.getters.darkmode"
    :maxHeight="$store.getters.valid ? 300 : 250"
  >
    <div class="thumbnail" slot="thumbnail">
      <div class="image">
        <img :src="exercise.thumbnail" alt="" />
      </div>
      <tl-grid minWidth="200" gap="0">
        <div class="title">{{ exercise.title }}</div>
        <tl-grid v-if="$store.getters.valid" minWidth="50" gap="0">
          <tc-button
            :tfbackground="
              $store.getters.darkmode ? 'container' : 'containerDark'
            "
            :tfcolor="!$store.getters.darkmode ? 'colorDark' : 'color'"
            icon="plus"
            name="Workout"
            @click.stop="addToWorkout"
          />
          <tc-button
            :tfbackground="
              $store.getters.darkmode ? 'container' : 'containerDark'
            "
            :tfcolor="!$store.getters.darkmode ? 'colorDark' : 'color'"
            icon="list"
            name="Liste"
            @click.stop="addToList"
          />
        </tl-grid>
      </tl-grid>
    </div>
    <fh-difficulty slot="thumbnail" :difficulty="exercise.difficulty" />

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
  .fh-difficulty,
  .thumbnail {
    position: absolute;
    left: 0;
  }
  .fh-difficulty {
    top: 0;
    margin: 10px;
  }
  .thumbnail {
    bottom: 0;
    right: 0;
    .image {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .tl-grid {
      background: $paragraph;
      @media (prefers-color-scheme: dark) {
        background: $paragraph_dark;
      }
      margin-top: -5px;
      padding: 20px;
      .title {
        font-weight: 800;
        font-size: 1.3em;
        display: grid;
        place-content: center start;
      }
      .tl-grid {
        margin-top: 10px;
        padding: 0;
      }
    }
  }

  .card-content {
    padding: 0 5vw;
  }
}
</style>
