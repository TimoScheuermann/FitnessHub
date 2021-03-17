<template>
  <FHPreview
    v-if="workout"
    class="fh-workout-preview"
    @click="handleClick"
    :title="workout.title"
  >
    <FHWorkoutThumbnail slot="media" :exercises="workout.exercises" />

    <div class="exercise-amount">
      <i class="ti-gym" />
      <span>Übungen: {{ workout.exercises.length }}</span>
    </div>

    <template slot="action">
      <tc-action-item
        success
        icon="share"
        title="Teilen"
        @click="$sW(workout)"
      />
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
    </template>
  </FHPreview>
</template>

<script lang="ts">
import backend from '@/utils/backend';
import { openFullscreen } from '@/utils/functions';
import { IWorkout } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { WorkoutManagement } from '@/utils/WorkoutManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHPreview from '../FHPreview.vue';
import FHWorkoutThumbnail from './FHWorkoutThumbnail.vue';

@Component({
  components: {
    FHWorkoutThumbnail,
    FHPreview
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

  .fh-workout-thumbnail {
    height: 210px;
    border-radius: $border-radius $border-radius 0 0;
  }
}
</style>
