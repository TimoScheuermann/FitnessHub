<template>
  <div class="view-exercises" content>
    <div max-width>
      <FHAppear>
        <div v-if="submitted && submitted.length > 0">
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

        <div v-else>
          <FHSearchBar v-model="query" />
          <tl-grid arrangement="auto-fill" minWidth="200">
            <FHExercisePreview
              v-for="a in accepted"
              :key="a._id"
              :exercise="a"
            />
          </tl-grid>
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
import FHSearchBar from '@/components/FHSearchBar.vue';

@Component({
  components: {
    FHAppear,
    FHCarousel,
    FHExercisePreview,
    FHSearchBar
  }
})
export default class Exercises extends Vue {
  public query = '';

  get accepted(): IExercise[] | null {
    const accepted: IExercise[] | null = ExerciseManagement.getAccepted();
    if (!accepted) return null;
    else if (this.query.length > 2) {
      return accepted.filter(x =>
        JSON.stringify(x)
          .toLowerCase()
          .includes(this.query.toLowerCase())
      );
    } else {
      return accepted;
    }
  }

  get submitted(): IExercise[] | null {
    return ExerciseManagement.getSubmitted();
  }
}
</script>

<style lang="scss" scoped>
.view-exercises {
  padding-top: 0;

  .fh-search-bar {
    margin-top: -10px;
    margin-bottom: 10px;
  }
}
</style>
