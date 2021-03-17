<template>
  <div class="fh-spontaneous-workout">
    <transition name="workout-button">
      <div
        class="workout-button"
        v-if="showButton && exercises.length > 0"
        @click="listVisible = !listVisible"
      >
        <i class="ti-list"></i>
        <div class="amount" v-if="exercises.length > 0">
          {{ exercises.length }}
        </div>
      </div>
    </transition>

    <transition name="workout-list">
      <div class="workout-list" v-if="listVisible && exercises.length > 0">
        <FHList>
          <FHListItem
            v-for="(e, i) in exercises"
            :key="i + e._id"
            :avatar="e.thumbnail"
            :title="e.title"
          >
            <tc-button
              icon="minus"
              tfbackground="error"
              @click="removeExercise(i)"
            />
          </FHListItem>
        </FHList>
        <tl-flow>
          <tc-button
            name="Workout starten"
            icon="play"
            tfbackground="success"
            variant="filled"
            @click="startWorkout"
          />
        </tl-flow>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { FHEventBus } from '@/utils/FHEventbus';
import { IExercise, IExerciseInfo } from '@/utils/interfaces';
import { WorkoutManagement } from '@/utils/WorkoutManagement';
import { Vue, Component } from 'vue-property-decorator';
import FHList from './list/FHList.vue';
import FHListItem from './list/FHListItem.vue';

@Component({
  components: {
    FHList,
    FHListItem
  }
})
export default class FHSpontaneousWorkout extends Vue {
  public exercises: IExercise[] = [];
  public listVisible = false;

  mounted() {
    FHEventBus.$on('add-to-list', this.addToList);
  }

  get showButton(): boolean {
    return [
      'training',
      'workout-details',
      'muscle-exercises',
      'exercise-search-results'
    ].includes(this.$route.name || 'noname');
  }

  public addToList(exercise: IExercise): void {
    this.exercises.push(exercise);
  }

  public removeExercise(index: number): void {
    this.exercises = this.exercises.filter((_x, i) => i !== index);
    if (this.exercises.length === 0) {
      this.listVisible = false;
    }
  }

  public startWorkout(): void {
    if (this.exercises.length > 0) {
      const ex: IExerciseInfo[] = this.exercises.map(x => {
        return {
          affectedMuscles: x.affectedMuscles,
          difficulty: x.difficulty,
          thumbnail: x.thumbnail,
          title: x.title,
          type: x.distance ? 'distance' : x.sets ? 'gym' : 'time',
          _id: x._id
        };
      });
      this.exercises = [];
      this.listVisible = false;

      WorkoutManagement.startWorkout(ex);
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-spontaneous-workout {
  .workout-list {
    z-index: 1000;
    position: fixed;
    bottom: calc(100px + env(safe-area-inset-bottom));
    @media #{$isDesktop} {
      right: calc(5vw + 50px);
    }
    @media #{$isMobile} {
      right: calc(50px + env(safe-area-inset-right));
    }

    max-height: 200px;
    overflow-y: auto;
    max-width: 70vw;
    border-radius: 25px;
    padding: 10px;

    @media #{$isDark} {
      @include backdrop-blur($background_dark);
    }
    @media #{$isLight} {
      @include backdrop-blur($background);
    }

    @include custom-scrollbar__dark();
    .fh-list {
      .fh-list-item {
        @media #{$isDark} {
          background: rgba($container_dark, 0.8);
          color: $color_dark;
        }
        @media #{$isLight} {
          background: rgba($container, 0.8);
          color: $color;
        }
        .tc-button {
          border-radius: 50px;
          margin-right: -5px;
        }

        margin-bottom: 10px;
      }
    }
  }
  .workout-button {
    z-index: 1000;
    position: fixed;
    bottom: calc(60px + env(safe-area-inset-bottom));
    @media #{$isDesktop} {
      right: 5vw;
    }
    @media #{$isMobile} {
      right: calc(10px + env(safe-area-inset-right));
    }

    @media #{$isDark} {
      background: $paragraph;
      color: $color;
    }
    @media #{$isLight} {
      background: $color;
      color: $paragraph;
    }

    $scale: 40px;
    height: $scale;
    width: $scale;
    border-radius: $scale;
    display: grid;
    place-content: center;
    cursor: pointer;
    .amount {
      background: $success;
      height: #{$scale / 1.5};
      width: #{$scale / 1.5};
      border-radius: #{$scale / 1.5};
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      display: grid;
      place-content: center;
      color: #fff;
    }
  }
}

.workout-button-enter,
.workout-button-leave-to {
  transform: translateX(10vw) scale(0);
  opacity: 0;
}
.workout-button-leave-active,
.workout-button-enter-active {
  transition: all 0.4s ease-in-out;
}

.workout-list-enter,
.workout-list-leave-to {
  transform: translate(calc(10vw + 80px), 80px) scale(0);
  opacity: 0;
}
.workout-list-leave-active,
.workout-list-enter-active {
  transition: all 0.4s ease-in-out;
}
</style>
