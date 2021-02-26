<template>
  <div class="view-exercise-submissions" content>
    <div max-width>
      <h3>Übungen</h3>

      <FHAppear>
        <p v-if="!submissions || submissions.length === 0">
          Es wurden bisher keine Übungen eingereicht
        </p>

        <tl-grid v-else arrangement="auto-fill" minWidth="200">
          <FHExercisePreview
            v-for="s in submissions"
            :key="s._id"
            :exercise="s.editedData || s"
            @click="$oFS('exercise-submission', { id: s._id })"
          />
        </tl-grid>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import FHExercisePreview from '@/components/training/FHExercisePreview.vue';
import { ExerciseManagement } from '@/utils/ExerciseManagement';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHExercisePreview,
    FHAppear
  }
})
export default class ExerciseSubmissions extends Vue {
  get submissions(): IExercise[] | null {
    return ExerciseManagement.getSubmissions();
  }
}
</script>

<style lang="scss" scoped>
.view-exercise-submissions {
  padding-top: 0;
  .tl-grid {
    .fh-exercise-preview {
      width: unset;
    }
  }
}
</style>
