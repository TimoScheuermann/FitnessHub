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
      <div max-width>
        <tl-flow horizontal="space-around" class="quick-information">
          <tl-flow flow="column" class="information">
            <div class="title">Level</div>
            <i class="ti-tiles-four"></i>
            <div class="value">{{ exercise.difficulty }}</div>
          </tl-flow>
          <tl-flow flow="column" class="information">
            <div class="title">Sets</div>
            <i class="ti-dots-vertical"></i>
            <div class="value">{{ exercise.sets }}</div>
          </tl-flow>
          <tl-flow flow="column" class="information">
            <div class="title">Reps</div>
            <i class="ti-repeat"></i>
            <div class="value">{{ exercise.reps }}</div>
          </tl-flow>
        </tl-flow>

        <FHHeading title="Muskeln" subtitle="betroffene" />
        <FHVarList>
          <FHVarListItem
            v-for="(m, i) in exercise.affectedMuscles"
            :key="i"
            :title="m"
            :to="{ name: 'muscle-exercises', params: { muscle: m } }"
          />
        </FHVarList>

        <template v-if="exercise.warnings && exercise.warnings.length > 0">
          <br />
          <FHHeading title="Hinweise" subtitle="authoren" />
          <tc-quote
            :dark="$store.getters.darkmode"
            v-for="(w, i) in exercise.warnings"
            :title="w"
            :key="'w-' + i"
            tfcolor="error"
          />
        </template>

        <template v-if="exercise.steps && exercise.steps.length > 0">
          <br />
          <FHHeading title="Ausführung" subtitle="richtige" />

          <div class="exercise-steps">
            <div
              class="exercise-step"
              v-for="(s, i) in exercise.steps"
              :key="'s-' + i"
            >
              <div class="numb">{{ i + 1 }}</div>
              <div class="text">{{ s }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHButton from '@/components/FHButton.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHHeading from '@/components/FHHeading.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import FHVarList from '@/components/variable-list/FHVarList.vue';
import FHVarListItem from '@/components/variable-list/FHVarListItem.vue';
import backend from '@/utils/backend';
import { addExerciseToWorkout, closeFullscreen } from '@/utils/functions';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHSwipeable,
    FHButton,
    FHHeader,
    FHHeading,
    FHVarList,
    FHVarListItem
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

  .tl-grid {
    left: 50%;
    transform: translate(-50%, calc(-100% - 40px));
    position: absolute;
    z-index: 10;
  }

  /deep/ .tc-quote--text {
    display: none;
  }
  /deep/ .tc-quote--title__prestyled {
    margin-bottom: 0 !important;
  }

  [content] {
    padding-top: 0;

    .quick-information {
      margin-bottom: 20px;
      .information {
        width: 70px;
        padding: 0 10px;
        .title {
          text-transform: uppercase;
          font-size: 14px;
          font-weight: bold;
          opacity: 0.75;
        }
        i {
          margin: 7.5px 0;
          font-size: 2em;
        }
        .value {
          font-weight: 500;
        }
      }
    }

    .exercise-steps {
      .exercise-step {
        &:not(:first-of-type) {
          margin-top: 20px;
        }
        display: grid;
        grid-template-columns: 40px 1fr;
        grid-gap: 10px;
        .numb {
          display: grid;
          place-content: center;
          height: 30px;
          width: 30px;
          border-radius: 30px;
          color: #fff;
          background: $success;
          font-weight: 500;
        }
        .text {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
