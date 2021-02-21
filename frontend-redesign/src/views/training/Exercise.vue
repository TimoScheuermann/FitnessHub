<template>
  <div class="view-Exercise">
    <FHHeader v-if="exercise" :title="exercise.title" :trigger="250" />
    <FHFullScreenCloser @click="$cFS('training')" />
    <FHSwipeable @swipeDown="$cFS('training')">
      <tc-hero :dark="$store.getters.darkmode">
        <img v-if="exercise" :src="exercise.thumbnail" slot="background" />
        <tl-flow v-else-if="!error" flow="column">
          <tc-spinner
            variant="dots-spin"
            size="30"
            :dark="$store.getters.darkmode"
          />
          <p>Übung wird geladen...</p>
        </tl-flow>
        <tl-flow v-else flow="column">
          <i huge error class="ti-exclamation-triangle" />
          <p>Übung konnte nicht geladen werden</p>
        </tl-flow>
      </tc-hero>
    </FHSwipeable>
    <div content v-if="exercise">
      <tl-grid minWidth="150" gap="10" max-width>
        <FHButton
          :frosted="true"
          icon="plus"
          title="Workout"
          @click="addToWorkout"
        />
        <FHButton :frosted="true" icon="list" title="Liste" />
      </tl-grid>
      <h1 center>{{ exercise.title }}</h1>
      <div max-width></div>
    </div>
  </div>
</template>

<script lang="ts">
import FHButton from '@/components/FHButton.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import backend from '@/utils/backend';
import { addExerciseToWorkout, closeFullscreen } from '@/utils/functions';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHSwipeable,
    FHButton,
    FHHeader
  }
})
export default class Exercise extends Vue {
  public exercise: IExercise | null = null;
  public error = false;

  mounted() {
    backend
      .get('exercise/' + this.$route.params.id)
      .then(res => {
        this.exercise = res.data;
      })
      .catch(() => {
        this.error = true;
        closeFullscreen('training');
      });
  }

  public addToWorkout(): void {
    if (this.exercise) {
      addExerciseToWorkout(this.exercise._id);
    }
  }
}
</script>

<style lang="scss" scoped>
.view-Exercise {
  min-height: 100vh;

  [content] {
    padding-top: 0;
  }

  .tl-grid {
    left: 50%;
    transform: translate(-50%, calc(-100% - 40px));
    position: absolute;
    z-index: 10;
  }
}
</style>
