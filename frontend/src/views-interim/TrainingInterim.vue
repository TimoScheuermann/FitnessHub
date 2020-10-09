<template>
  <div class="profile-interim">
    <fh-mobile-header :title="categoryInfo.title">
      <tc-header-button
        v-if="$route.name !== 'training'"
        routeName="training"
        name="Training"
      />
      <!-- <tc-input
        slot="input"
        icon="lens"
        placeholder="Übung suchen"
        :frosted="true"
        :dark="$store.getters.darkmode"
        v-model="query"
        @input="search"
      /> -->
    </fh-mobile-header>

    <tc-hero :dark="true" :hasFixedHeader="false" :height="200">
      <template v-if="$route.name !== 'training-workout'">
        <img :src="categoryInfo.thumbnail" slot="background" alt="" />
        <transition name="hero-anim" mode="out-in">
          <h1 :key="categoryInfo.title">{{ categoryInfo.title }}</h1>
        </transition>
      </template>
    </tc-hero>
    <div class="view">
      <transition :name="$store.getters.routeTransition">
        <router-view
          class="child-view"
          :exercise="exercise"
          :error="loadingError"
        />
      </transition>
    </div>

    <transition name="slide-top">
      <div v-if="results.length > 0" class="search-results">
        <div class="list-wrapper">
          <fh-exercise-list>
            <fh-exercise-list-item
              v-for="e in results"
              :key="e._id"
              :exercise="e"
              @click="openDetails(e)"
            />
          </fh-exercise-list>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import FHDifficulty from '@/components/common/FH-Difficulty.vue';
import FHExercise from '@/components/exercise/FH-Exercise.vue';
import FHExerciseList from '@/components/shared/exercise-list/FH-ExerciseList.vue';
import FHExerciseListItem from '@/components/shared/exercise-list/FH-ExerciseListItem.vue';
import FHWorkoutThumbnail from '@/components/workout/thumbnail/FH-Workout-Thumbnail.vue';
import axios from '@/utils/axios';
import { EventBus } from '@/utils/eventbus';
import { getExercise, getMuscleNames } from '@/utils/functions';
import { IExercise, IWorkout } from '@/utils/interfaces';
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({
  components: {
    'fh-exercise': FHExercise,
    'fh-difficulty': FHDifficulty,
    'fh-workout-thumbnail': FHWorkoutThumbnail,
    'fh-exercise-list': FHExerciseList,
    'fh-exercise-list-item': FHExerciseListItem
  }
})
export default class ProfileInterim extends Vue {
  public workout: IWorkout | null = null;
  public loadingError = false;
  public exercise: IExercise | null = null;
  public query = '';
  public results: IExercise[] = [];

  mounted() {
    this.routeNameChanged(this.$route.name + '');

    EventBus.$on('training-interim-exercise', (exercise: IExercise) => {
      this.$router.push({
        name: 'training-exercise',
        params: { id: exercise._id }
      });
    });
  }

  public search(query: string = this.query): void {
    if (query.length < 2) {
      this.results.splice(0, this.results.length);
    } else {
      axios.get('exercise/find/' + query).then(res => {
        this.results = res.data;
      });
    }
  }

  public openDetails(ex: IExercise) {
    EventBus.$emit('modal-exercise-details', ex);
  }

  @Watch('$route.name', { immediate: true })
  public routeNameChanged(to: string): void {
    if (to === 'training-exercise') {
      this.loadingError = false;
      this.exercise = null;

      getExercise(this.$route.params.id, (data: IExercise | null) => {
        this.exercise = data;
        if (!data) {
          this.loadingError = true;
        }
      });
    }
  }

  get categoryInfo(): {
    title: string;
    thumbnail: string;
  } {
    let title = 'Training';
    let thumbnail: string | undefined = '1549060279-7e168fcee0c2';
    if (this.$route.name === 'training-muscle') {
      title = getMuscleNames().filter(
        x => x.toLowerCase() === this.$route.params.muscle.toLowerCase()
      )[0];
    } else if (this.$route.name === 'training-wiki') {
      title = 'Trainings Wiki';
      thumbnail = '1571019614242-c5c5dee9f50b';
    } else if (this.$route.name === 'training-workout') {
      if (this.workout) {
        title = this.workout.title;
      } else {
        title = 'Workout';
      }
    } else if (this.$route.name === 'training-exercise' && this.exercise) {
      return {
        title: this.exercise.title,
        thumbnail: this.exercise.thumbnail
      };
    }
    return {
      title: title,
      thumbnail: `https://images.unsplash.com/photo-${thumbnail}?w=1080&q=5`
    };
  }

  public openSearch(): void {
    EventBus.$emit('modal-exercise-search', 'training-interim-exercise');
  }
}
</script>
<style lang="scss" scoped>
.tc-hero {
  img {
    filter: brightness(60%);
  }
  h1 {
    margin: 0px;
    margin-top: env(safe-area-inset-top);
    text-transform: capitalize;
  }
}

.hero-anim-enter-active,
.hero-anim-leave-active {
  transition: all 0.16s cubic-bezier(0.55, 0, 0.1, 1);
}
.hero-anim-enter,
.hero-anim-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.hero-input {
  margin-top: 20px;
  .tc-input {
    width: 80vw;
    max-width: 400px;
    padding: 10px;
  }
}
.tc-button.search {
  margin-right: calc(-10vw + 5px + env(safe-area-inset-right));
}
.search-results {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  .list-wrapper {
    padding: calc(120px + env(safe-area-inset-top)) 5vw
      calc(70px + env(safe-area-inset-bottom));
    max-height: calc(
      100vh - 190px - env(safe-area-inset-top) - env(safe-area-inset-bottom)
    );
    overflow-y: auto;
  }
}

.slide-top-enter,
.slide-bottom-leave-active {
  opacity: 0;
  transform: translate(0, 60px);
}
.slide-top-leave-active,
.slide-bottom-enter {
  opacity: 0;
  transform: translate(0, -60px);
}
</style>
