<template>
  <div class="view-Workout">
    <FHHeader v-if="workout" :title="workout.title" :trigger="250" />
    <FHFullScreenCloser @click="$cFS('training')" />
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
          <div class="media" v-if="thumbnails" :thumbnails="thumbnails.length">
            <div
              class="exercise-thumbnail"
              v-for="(t, i) in thumbnails"
              :key="i"
              :style="`background-image: url('${t}')`"
            />
          </div>
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
        <FHButton :frosted="true" icon="play" title="Start" />
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
import backend from '@/utils/backend';
import { closeFullscreen, formatTimeForMessage } from '@/utils/functions';
import { IExerciseInfo, IUserInfo, IWorkout } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHSwipeable,
    FHButton,
    FHWorkoutExercise,
    FHHeader
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

  get thumbnails(): string[] | null {
    if (!this.workout || !this.workout.exercises) {
      return null;
    }

    const { exercises } = this.workout;
    const length = exercises.length;
    if (length === 0) return null;

    let selection: IExerciseInfo[] = [];
    if (length < 4) selection = exercises.slice(0, 1);
    else if (length < 9) selection = exercises.slice(0, 4);
    else selection = exercises.slice(0, 9);
    return selection.map(x => x.thumbnail);
  }

  get tsUpdated(): string {
    if (!this.workout) return '';
    return formatTimeForMessage(this.workout.updated);
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
      .media {
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
      .media {
        height: 200px;
        width: 200px;
        overflow: hidden;
        border-radius: $border-radius;
        display: grid;
        &[thumbnails='1'] {
          grid-template-columns: 1fr;
        }
        &[thumbnails='4'] {
          grid-template-columns: 1fr 1fr;
        }
        &[thumbnails='9'] {
          grid-template-columns: 1fr 1fr 1fr;
        }

        div {
          background-position: center;
          background-size: cover;
        }
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
