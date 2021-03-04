<template>
  <div class="view-create-workout">
    <div content max-width>
      <FHHeader title="Workout erstellen">
        <FHFullScreenCloser @click="$cFS('workouts')" />
      </FHHeader>
      <br />
      <h1 center>Workout erstellen</h1>
      <br />
      <FHWorkoutForm />
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHWorkoutForm from '@/components/forms/FHWorkoutForm.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHHeader,
    FHFullScreenCloser,
    FHWorkoutForm
  }
})
export default class CreateWorkout extends Vue {}
</script>

<style lang="scss" scoped>
.view-create-workout {
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
