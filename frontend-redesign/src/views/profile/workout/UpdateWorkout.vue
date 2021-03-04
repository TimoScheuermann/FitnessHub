<template>
  <div class="view-update-workout">
    <div content max-width>
      <FHHeader title="Workout bearbeiten">
        <FHFullScreenCloser @click="$cFS('workouts')" />
      </FHHeader>
      <br />
      <h1 center>Workout bearbeiten</h1>
      <br />
      <tl-flow v-if="!workout">
        <tc-spinner :dark="$store.getters.darkmode" size="20" />
      </tl-flow>
      <FHWorkoutForm v-else :workout="workout" />
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHWorkoutForm from '@/components/forms/FHWorkoutForm.vue';
import { closeFullscreen } from '@/utils/functions';
import { IWorkout } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHHeader,
    FHFullScreenCloser,
    FHWorkoutForm
  }
})
export default class UpdateWorkout extends Vue {
  public workout: IWorkout | null = null;

  async mounted() {
    if (!this.workout) {
      await UserManagement.loadWorkouts();
      this.workout = UserManagement.getWorkout(this.$route.params.id);
    }
    if (!this.workout) {
      closeFullscreen('workouts');
    }
  }
}
</script>

<style lang="scss" scoped>
.view-update-workout {
  min-height: 100vh;
  color: #fff;

  background: linear-gradient(rgba($color, 0.6), rgba($color, 0.2)),
    url('/assets/workout-bg.webp');
  background-size: cover;
  background-position: center center;

  [content] {
    padding-bottom: 20px;
  }
}
</style>
