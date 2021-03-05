<template>
  <div class="fh-workout-preview" cursor v-if="workout" @click="handleClick">
    <FHWorkoutThumbnail :exercises="workout.exercises" />
    <div class="title">{{ workout.title }}</div>
    <tl-flow horizontal="space-between">
      <div class="exercise-amount">
        <i class="ti-gym" />
        <span>Übungen: {{ workout.exercises.length }}</span>
      </div>
      <tc-action :dark="$store.getters.darkmode">
        <tc-action-item
          icon="play"
          title="Workout starten"
          @click="startWorkout"
        />
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
import { IWorkout } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { WorkoutManagement } from '@/utils/WorkoutManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHWorkoutThumbnail from './FHWorkoutThumbnail.vue';

@Component({
  components: {
    FHWorkoutThumbnail
  }
})
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

  public startWorkout() {
    if (this.workout) {
      WorkoutManagement.startWorkout(this.workout.exercises);
    }
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

  .fh-workout-thumbnail {
    height: 210px;
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
