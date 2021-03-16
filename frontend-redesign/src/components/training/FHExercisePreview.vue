<template>
  <FHPreview
    v-if="exercise"
    class="fh-exercise-preview"
    @click="handleClick"
    :title="exercise.title"
  >
    <img slot="media" :src="exercise.thumbnail" alt="" />
    <div class="level">
      <span>Level</span>
      <i
        v-for="(k, i) in Array(exercise.difficulty)"
        :key="i"
        class="ti-circle"
        :difficulty="exercise.difficulty"
      />
    </div>
    <template slot="action" v-if="exercise.reviewed">
      <tc-action-item icon="plus" title="Workout" @click="addToWo" />
      <tc-action-item icon="list" title="Liste" />
      <tc-action-item
        icon="i-circle-filled"
        title="Details"
        @click="handleClick"
      />
      <tc-action-item
        v-if="isAuthor"
        alarm
        title="Übung bearbeiten"
        icon="pencil"
        @click="updateExercise"
      />
      <tc-action-item success icon="share" title="Teilen" />
    </template>
    <template v-else-if="$route.name === 'exercise-submissions'">
      <tc-action-item
        icon="pencil"
        title="Anfrage bearbeiten"
        @click="handleClick"
      />
    </template>
    <template v-else>
      <tc-action-item
        error
        icon="trashcan-alt"
        title="Übung löschen"
        @click="cancelSubmission"
      />
    </template>
  </FHPreview>
</template>

<script lang="ts">
import backend from '@/utils/backend';
import { ExerciseManagement } from '@/utils/ExerciseManagement';
import { openFullscreen } from '@/utils/functions';
import { IExercise } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHPreview from '../FHPreview.vue';

@Component({
  components: {
    FHPreview
  }
})
export default class FHExercisePreview extends Vue {
  @Prop() exercise!: IExercise;

  get isAuthor(): boolean {
    if (!this.exercise) return false;
    return this.exercise.author === UserManagement.getUserID();
  }

  public handleClick(e: Event) {
    this.$emit('click', e);
    if (
      this.exercise &&
      this.exercise.reviewed &&
      this.$route.name !== 'exercise-submissions'
    ) {
      openFullscreen('exercise-details', { id: this.exercise._id });
    }
  }

  public updateExercise(): void {
    if (this.isAuthor) {
      openFullscreen('update-exercise', { id: this.exercise._id });
    }
  }

  public addToWo(): void {
    if (this.exercise) {
      ExerciseManagement.addToWorkout(this.exercise);
    }
  }

  public cancelSubmission(): void {
    if (this.exercise) {
      backend.delete('exercise/cancelSubmission/' + this.exercise._id);
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-exercise-preview {
  .level {
    margin-left: 10px;
    opacity: 0.7;
    span {
      font-size: 14px;
    }
    i {
      margin-left: 5px;
      font-size: 10px;

      &[difficulty='1'] {
        color: $success;
      }
      &[difficulty='2'] {
        color: $alarm;
      }
      &[difficulty='3'] {
        color: $error;
      }
    }
  }
}
</style>
