<template>
  <div
    class="fh-exercise-preview"
    cursor
    v-if="exercise"
    @click="handleClick"
    :style="`--thumbnail: url('${exercise.thumbnail}'`"
  >
    <div class="media" />
    <div class="title">{{ exercise.title }}</div>
    <tl-flow horizontal="space-between">
      <div class="level">
        <span>Level</span>
        <i
          v-for="(k, i) in Array(exercise.difficulty)"
          :key="i"
          class="ti-circle"
          :difficulty="exercise.difficulty"
        />
      </div>
      <tc-action :dark="$store.getters.darkmode">
        <template v-if="exercise.reviewed">
          <tc-action-item icon="plus" title="Workout" @click="addToWO" />
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
      </tc-action>
    </tl-flow>
  </div>
</template>

<script lang="ts">
import backend from '@/utils/backend';
import { addExerciseToWorkout, openFullscreen } from '@/utils/functions';
import { IExercise } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
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

  public addToWO(): void {
    if (this.exercise) {
      addExerciseToWorkout(this.exercise._id);
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
  border-radius: $border-radius;
  height: fit-content;

  background: $paragraph;
  @media #{$isDark} {
    background: $color;
  }
  box-shadow: $shadow-light;

  .media {
    height: 210px;
    background-position: center;
    background-size: cover;

    background-image: linear-gradient(
        to bottom,
        transparent calc(100% - 30px),
        $paragraph
      ),
      var(--thumbnail);
    @media #{$isDark} {
      background-image: linear-gradient(
          to bottom,
          transparent calc(100% - 30px),
          $color
        ),
        var(--thumbnail);
    }

    display: flex;
    justify-content: flex-end;
    border-radius: $border-radius $border-radius 0 0;
  }

  .title {
    margin: -12.5px 20px 0px;
    overflow-wrap: break-word;
    font-weight: bold;
    font-size: 1.4em;
  }
  .tl-flow {
    padding: 10px;
  }
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
