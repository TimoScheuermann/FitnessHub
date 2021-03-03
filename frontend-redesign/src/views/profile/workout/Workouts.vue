<template>
  <div class="view-workouts" content>
    <div max-width>
      <tl-flow horizontal="space-between">
        <h3>Meine Workouts</h3>
        <tc-link @click="$oFS('create-workout')" tfcolor="success">
          Workout erstellen
        </tc-link>
      </tl-flow>

      <FHAppear>
        <p v-if="!workouts || workouts.length === 0">
          Du hast noch kein Workout erstellt
        </p>

        <tl-grid v-else arrangement="auto-fill" minWidth="200">
          <FHWorkoutPreview v-for="w in workouts" :key="w._id" :workout="w" />
        </tl-grid>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHWorkoutPreview from '@/components/training/FHWorkoutPreview.vue';
import { IWorkout } from '@/utils/interfaces';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear,
    FHWorkoutPreview
  }
})
export default class Workouts extends Vue {
  get workouts(): IWorkout[] | null {
    return UserManagement.getWorkouts();
  }
}
</script>

<style lang="scss" scoped>
.view-workouts {
  padding-top: 0;
}
</style>
