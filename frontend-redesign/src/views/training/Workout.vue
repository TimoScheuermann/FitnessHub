<template>
  <div class="view-Workout">
    <FHHeader v-if="workout" :title="workout.title" :trigger="250">
      <FHFullScreenCloser @click="$cFS('training')" />
    </FHHeader>
    <FHSwipeable @swipeDown="$cFS('training')">
      <tc-hero :dark="true || $store.getters.darkmode">
        <img v-if="workout" src="assets/hero/home.webp" slot="background" />
        <tl-flow v-else-if="!error" flow="column">
          <tc-spinner
            variant="dots-spin"
            size="30"
            :dark="$store.getters.darkmode"
          />
          <p>Workout wird geladen...</p>
        </tl-flow>
        <tl-flow v-else flow="column">
          <i huge error class="ti-exclamation-triangle" />
          <p>Workout konnte nicht geladen werden</p>
        </tl-flow>

        <div class="hero-container" v-if="workout">
          <FHWorkoutThumbnail :exercises="workout.exercises" />
          <div class="workout-information" center>
            <template v-if="author">
              <tc-avatar :src="author.avatar" size="tiny" />
              <div class="author">{{ author.username }}</div>
            </template>
            <div class="updated">updated {{ tsUpdated }}</div>
          </div>
        </div>
      </tc-hero>
    </FHSwipeable>
    <div content v-if="workout">
      <tl-grid minWidth="150" gap="10" max-width>
        <FHButton
          :frosted="true"
          icon="play"
          title="Start"
          @click="startWorkout"
        />
        <FHButton :frosted="true" icon="cloud-dowbload" title="Download" />
      </tl-grid>
      <h1 center>{{ workout.title }}</h1>
      <div max-width>
        <FHWorkoutExercise
          v-for="(e, i) in workout.exercises"
          :key="i"
          :exercise="e"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FHButton from '@/components/FHButton.vue';
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import FHWorkoutExercise from '@/components/training/FHWorkoutExercise.vue';
import FHWorkoutThumbnail from '@/components/training/FHWorkoutThumbnail.vue';
import backend from '@/utils/backend';
import { closeFullscreen, formatTimeForMessage } from '@/utils/functions';
import { IUserInfo, IWorkout } from '@/utils/interfaces';
import { WorkoutManagement } from '@/utils/WorkoutManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHSwipeable,
    FHButton,
    FHWorkoutExercise,
    FHHeader,
    FHWorkoutThumbnail
  }
})
export default class Exercise extends Vue {
  public workout: IWorkout | null = null;
  public error = false;
  public author: IUserInfo | null = null;

  mounted() {
    backend
      .get('workout/' + this.$route.params.id)
      .then(async res => {
        this.workout = res.data;

        if (!this.workout) return;
        const { data } = await backend.get('user/' + this.workout.author);
        this.author = data;
      })
      .catch(() => {
        this.error = true;
        closeFullscreen('training');
      });
  }

  get tsUpdated(): string {
    if (!this.workout) return '';
    return formatTimeForMessage(this.workout.updated);
  }

  public startWorkout(): void {
    if (this.workout) {
      WorkoutManagement.startWorkout(this.workout.exercises);
    }
  }
}
</script>

<style lang="scss" scoped>
.view-Workout {
  min-height: 100vh;

  .tc-hero {
    img[src='assets/hero/home.webp'] {
      filter: blur(10px) brightness(80%);
    }

    padding-top: env(safe-area-inset-top);
    @media only screen and(max-width: 599px) {
      height: 400px;
      .fh-workout-thumbnail {
        margin-top: -40px;
        margin-bottom: 10px;
      }
      .tc-avatar {
        display: none;
      }
    }
    @media only screen and(min-width: 600px) {
      height: 350px;
      .hero-container {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 30px;
        margin-top: -80px;
      }
    }
    .hero-container {
      .workout-information {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        .tc-avatar {
          margin-bottom: 5px;
        }
        .author {
          color: #25ca49;
          margin-bottom: 2.5px;
        }
        .updated {
          opacity: 0.75;
          font-size: 13px;
          text-transform: uppercase;
        }
      }
      .fh-workout-thumbnail {
        height: 200px;
        width: 200px;
      }
    }
  }

  [content] {
    padding-top: 0;
    .tl-grid {
      left: 50%;
      transform: translate(-50%, calc(-100% - 40px));
      position: absolute;
      z-index: 10;
    }
  }
}
</style>
