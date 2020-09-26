<template>
  <div class="fh-workout-head">
    <div class="background">
      <img src="assets/hero/fh-hero-blur.webp" alt="" />
    </div>
    <tl-grid gap="10">
      <tl-flow>
        <fh-workout-thumbnail :workout="workout" />
      </tl-flow>
      <tl-flow flow="column">
        <div class="title">{{ workout.title }}</div>
        <div class="author" v-if="username.length > 0">{{ username }}</div>
        <div class="updated">updated {{ workoutUpdated }}</div>
        <div class="buttons" v-if="$store.getters.valid">
          <fh-button icon="play" title="Start" @click="start" />
          <fh-button icon="cloud-download" title="Download" />
        </div>
      </tl-flow>
    </tl-grid>
  </div>
</template>

<script lang="ts">
import FHButton from '@/components/shared/FH-Button.vue';
import { EventBus } from '@/utils/eventbus';
import { formatTimeForMessage, getUserName } from '@/utils/functions';
import {
  IExerciseShowcase,
  IUser,
  IUserInfo,
  IWorkout
} from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHWorkoutThumbnail from '../thumbnail/FH-Workout-Thumbnail.vue';

@Component({
  components: {
    'fh-workout-thumbnail': FHWorkoutThumbnail,
    'fh-button': FHButton
  }
})
export default class FHWorkoutHead extends Vue {
  @Prop() workout!: IWorkout;
  @Prop() user!: IUser | IUserInfo;

  get username(): string {
    return getUserName(this.user) || '';
  }

  get workoutUpdated(): string {
    if (!this.workout) return '';
    return formatTimeForMessage(this.workout.updated);
  }

  public start(): void {
    if (this.workout) {
      EventBus.$emit(
        'modal-start-workout',
        this.workout.exercises.map(x => {
          return {
            _id: x._id,
            title: x.title,
            thumbnail: x.thumbnail,
            type: x.type
          } as IExerciseShowcase;
        })
      );
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-workout-head {
  user-select: none;
  position: relative;
  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .tl-grid {
    padding: 20px 0;
    position: relative;
    @include backdrop-blur(#aaa);
    @media (prefers-color-scheme: dark) {
      @include backdrop-blur($paragraph_dark);
    }
    .fh-workout-thumbnail {
      height: 90vw;
      width: 90vw;
      max-height: 200px;
      max-width: 200px;
      border-radius: $border-radius;
    }
    .tl-flow {
      font-weight: 600;
      .title {
        font-weight: 700;
        padding: 10px 0;
        font-size: 1.3em;
      }
      .author {
        color: $success;
        margin-bottom: 2.5px;
      }
      .updated {
        opacity: 0.75;
        font-size: 13px;
        text-transform: uppercase;
      }
      .buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 20px;
        padding: 20px;
        padding-bottom: 0;
        max-width: 300px;
      }
    }
  }
}
</style>
