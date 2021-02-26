<template>
  <div class="view-exercises" content>
    <div max-width>
      <tl-flow horizontal="space-between">
        <h3>Meine Übungen</h3>
        <tc-link routeName="submit-exercise" tfcolor="success">
          Übung einreichen
        </tc-link>
      </tl-flow>

      <FHAppear>
        <p v-if="!accepted || accepted.length === 0">
          Du hast noch keine eigene Übung veröffentlicht
        </p>

        <FHCarousel v-else>
          <FHExercisePreview v-for="a in accepted" :key="a._id" :exercise="a" />
        </FHCarousel>
      </FHAppear>

      <FHAppear>
        <div v-if="submitted && submitted.length > 0">
          <br />
          <h3>Eingereichte Übungen</h3>
          <FHCarousel>
            <FHExercisePreview
              v-for="s in submitted"
              :key="s._id"
              :exercise="s"
            />
          </FHCarousel>
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FHAppear from '@/components/FHAppear.vue';
import FHCarousel from '@/components/FHCarousel.vue';
import FHExercisePreview from '@/components/training/FHExercisePreview.vue';
import { IExercise } from '@/utils/interfaces';
import { ExerciseManagement } from '@/utils/ExerciseManagement';

@Component({
  components: {
    FHAppear,
    FHCarousel,
    FHExercisePreview
  }
})
export default class Exercises extends Vue {
  get accepted(): IExercise[] | null {
    return ExerciseManagement.getAccepted();
  }

  get submitted(): IExercise[] | null {
    return ExerciseManagement.getSubmitted();
  }
}
</script>

<style lang="scss" scoped>
.view-exercises {
  padding-top: 0;
}
</style>
