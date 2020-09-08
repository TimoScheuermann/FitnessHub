<template>
  <div class="exercises">
    <div sub-content>
      <h1>Historie</h1>
      <p>soon</p>

      <tl-flow horizontal="space-between">
        <h1>Meine</h1>
        <tc-link tfcolor="success" routeName="submitExercise">
          Übung einreichen
        </tc-link>
      </tl-flow>
    </div>

    <template v-if="published.length > 0">
      <div sub-content>
        <tc-badge :value="published.length" position="inside">
          <h3>Veröffentlicht</h3>
        </tc-badge>
      </div>
      <div class="exercise-carousel">
        <fh-exercise v-for="e in published" :key="e._id" :exercise="e" />
        <div class="ce" />
      </div>
    </template>
    <template v-if="unpublished.length > 0">
      <div sub-content>
        <tc-badge :value="unpublished.length" position="inside">
          <h3>Eingereicht</h3>
        </tc-badge>
      </div>
      <div class="exercise-carousel">
        <fh-exercise v-for="e in unpublished" :key="e._id" :exercise="e" />
        <div class="ce" />
      </div>
    </template>
    <template v-if="edited.length > 0">
      <div sub-content>
        <tc-badge :value="edited.length" position="inside">
          <h3>Änderungen</h3>
        </tc-badge>
      </div>
      <div class="exercise-carousel">
        <fh-exercise
          v-for="e in edited"
          :key="e._id"
          :exercise="{ ...e, ...e.editedData }"
        />
        <div class="ce" />
      </div>
    </template>
    <div class="spacer" />
  </div>
</template>

<script lang="ts">
import FHExercise from '@/components/shared/FH-Exercise.vue';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-exercise': FHExercise
  }
})
export default class Exercises extends Vue {
  get exercises(): IExercise[] {
    return this.$store.getters.exercises;
  }
  get published(): IExercise[] {
    return this.exercises.filter(x => x.reviewed);
  }
  get unpublished(): IExercise[] {
    return this.exercises.filter(x => !x.reviewed);
  }
  get edited(): IExercise[] {
    return this.exercises.filter(x => x.editedData);
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin: 0;
}

.spacer {
  height: calc(20px + env(safe-area-inset-bottom));
  @media #{$isMobile} {
    height: calc(70px + env(safe-area-inset-bottom));
  }
}
[sub-content] {
  padding: 0 5vw;
}

.exercise-carousel {
  margin-top: 20px;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  @include custom-scrollbar__light();
  @media (prefers-color-scheme: dark) {
    @include custom-scrollbar__dark();
  }

  .ce {
    flex-shrink: 0;
    width: 5vw;
  }
  .fh-exercise {
    width: 250px;
    margin-left: 30px;
    scroll-snap-align: center;
    flex-shrink: 0;
    &:first-child {
      margin-left: 5vw;
    }
  }
}
</style>
