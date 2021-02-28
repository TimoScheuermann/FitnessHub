<template>
  <div class="view-update-exercise">
    <FHHeader v-if="exercise" :title="exercise.title" :trigger="250">
      <FHFullScreenCloser @click="close()" />
    </FHHeader>
    <FHSwipeable @swipeDown="close()">
      <tc-hero :dark="$store.getters.darkmode">
        <img v-if="exercise" :src="exercise.thumbnail" slot="background" />
        <tl-flow v-else flow="column">
          <tc-spinner
            variant="dots-spin"
            size="30"
            :dark="$store.getters.darkmode"
          />
          <p>Übung wird geladen...</p>
        </tl-flow>
      </tc-hero>
    </FHSwipeable>
    <div content v-if="exercise">
      <FHExerciseForm @close="close()" :exercise="exercise" />
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import FHExerciseForm from '@/components/forms/FHExerciseForm.vue';
import backend from '@/utils/backend';
import { ExerciseManagement } from '@/utils/ExerciseManagement';
import { closeFullscreen } from '@/utils/functions';
import { IFHNotification, IExercise } from '@/utils/interfaces';
import { NotificationManagement } from '@/utils/NotificationManagement';
import { UserManagement } from '@/utils/UserManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHHeader,
    FHSwipeable,
    FHFullScreenCloser,
    FHExerciseForm
  }
})
export default class UpdateExercise extends Vue {
  public exercise: IExercise | null = null;

  mounted() {
    const ID = this.$route.params.id;
    const creations = ExerciseManagement.getCreated();
    if (!UserManagement.getUserID()) {
      this.close();
    } else if (!creations) {
      this.notFound();
    } else if (creations) {
      const exercise = creations.filter(
        x =>
          x._id === ID && x.author === UserManagement.getUserID() && x.reviewed
      )[0];
      if (exercise) {
        this.exercise = exercise;
      } else {
        this.notFound();
      }
    } else {
      backend
        .get('exercise/' + ID)
        .then(res => {
          const exercise: IExercise = res.data;
          if (!exercise || !exercise._id) {
            this.notFound();
            return;
          }
          if (exercise.author !== UserManagement.getUserID()) {
            this.close({
              title: 'Berechtigungsfehler',
              text: 'Du bist nicht der Ersteller der Übung!'
            });
            return;
          }
          this.exercise = exercise;
        })
        .catch(() => this.notFound);
    }
  }

  public close(errorMessage?: IFHNotification) {
    if (errorMessage) {
      NotificationManagement.sendNotification(
        errorMessage.title,
        errorMessage.text
      );
    }
    closeFullscreen('exercises');
  }

  public notFound(): void {
    this.close({
      title: 'Erfolglose Suche',
      text: 'Die angegebene Übung konnte nicht gefunden werden'
    });
  }
}
</script>

<style lang="scss" scoped>
.view-update-exercise {
  min-height: 100vh;

  [content] {
    padding-top: 0;
  }
}
</style>
