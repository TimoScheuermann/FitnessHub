<template>
  <div
    class="fh-workout-preview"
    cursor
    v-if="workout && thumbnails"
    @click="handleClick"
  >
    <div class="media" :thumbnails="thumbnails.length">
      <div
        class="exercise-thumbnail"
        v-for="(t, i) in thumbnails"
        :key="i"
        :style="`background-image: url('${t}')`"
      />
    </div>
    <div class="title">{{ workout.title }}</div>
    <tl-flow horizontal="space-between">
      <div class="exercise-amount">
        <i class="ti-gym" />
        <span>Übungen: {{ workout.exercises.length }}</span>
      </div>
      <tc-action :dark="$store.getters.darkmode">
        <tc-action-item icon="play" title="Workout starten" />
        <tc-action-item
          icon="i-circle-filled"
          title="Details"
          @click="handleClick"
        />
        <tc-action-item
          v-if="isAuthor"
          alarm
          title="Bearbeiten"
          icon="pencil"
          @click="updateWorkout"
        />
        <tc-action-item
          v-if="isAuthor"
          error
          title="Löschen"
          icon="trashcan-alt"
          @click="deleteWorkout"
        />

        <tc-action-item success icon="share" title="Teilen" />
      </tc-action>
    </tl-flow>
  </div>
</template>

<script lang="ts">
import backend from '@/utils/backend';
import { openFullscreen } from '@/utils/functions';
import { IExerciseInfo, IWorkout } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHWorkoutPreview extends Vue {
  @Prop() workout!: IWorkout;

  get isAuthor(): boolean {
    if (!this.workout) return false;
    return this.workout.author === UserManagement.getUserID();
  }

  public handleClick(e: Event) {
    this.$emit('click', e);
    if (this.workout) {
      openFullscreen('workout-details', { id: this.workout._id });
    }
  }

  public updateWorkout() {
    if (this.workout) {
      openFullscreen('update-workout', { id: this.workout._id });
    }
  }

  public deleteWorkout() {
    if (this.workout) {
      backend.delete('workout/' + this.workout._id);
      UserManagement.removeWorkout(this.workout._id);
    }
  }

  get thumbnails(): string[] | null {
    if (!this.workout || !this.workout.exercises) {
      return null;
    }

    const { exercises } = this.workout;
    const length = exercises.length;
    if (length === 0) return null;

    let selection: IExerciseInfo[] = [];
    if (length < 4) selection = exercises.slice(0, 1);
    else if (length < 9) selection = exercises.slice(0, 4);
    else selection = exercises.slice(0, 9);
    return selection.map(x => x.thumbnail);
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-preview {
  border-radius: $border-radius;
  height: fit-content;

  background: $paragraph;
  @media #{$isDark} {
    background: $color;
  }
  box-shadow: $shadow-light;

  .media {
    height: 210px;

    display: grid;
    &[thumbnails='1'] {
      grid-template-columns: 1fr;
    }
    &[thumbnails='4'] {
      grid-template-columns: 1fr 1fr;
    }
    &[thumbnails='9'] {
      grid-template-columns: 1fr 1fr 1fr;
    }

    div {
      background-position: center;
      background-size: cover;
    }
    overflow: hidden;
    border-radius: $border-radius $border-radius 0 0;
  }

  .title {
    border-radius: 0 0 $border-radius $border-radius;
    margin-top: -12.5px;
    position: relative;
    padding: 0 20px;
    overflow-wrap: break-word;
    font-weight: bold;
    font-size: 1.4em;

    background-image: linear-gradient(
      to bottom,
      transparent,
      $paragraph 12.5px
    );
    @media #{$isDark} {
      background-image: linear-gradient(to bottom, transparent, $color 12.5px);
    }
  }
  .tl-flow {
    padding: 10px;
  }
  .exercise-amount {
    margin-left: 10px;
    opacity: 0.7;
    i {
      margin-right: 5px;
      font-size: 12px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
