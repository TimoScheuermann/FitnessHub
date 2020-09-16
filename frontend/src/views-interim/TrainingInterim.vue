<template>
  <div class="profile-interim">
    <fh-mobile-header :title="categoryInfo.title">
      <tc-header-button
        v-if="$route.name !== 'training'"
        routeName="training"
        name="Training"
      />
    </fh-mobile-header>

    <tc-hero
      :dark="true"
      :hasFixedHeader="$store.getters.fixedHeader"
      :height="200"
    >
      <img :src="categoryInfo.thumbnail" slot="background" alt="" />
      <transition name="hero-anim" mode="out-in">
        <h1 :key="categoryInfo.title">{{ categoryInfo.title }}</h1>
      </transition>
    </tc-hero>
    <div class="view">
      <transition :name="$store.getters.routeTransition">
        <router-view class="child-view" :workout="workout" />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { IWorkout } from '@/utils/interfaces';
import { muscles } from '@/utils/muscles';
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component
export default class ProfileInterim extends Vue {
  public workout: IWorkout | null = null;

  mounted() {
    this.routeNameChanged(this.$route.name + '');
  }

  @Watch('$route.name')
  public routeNameChanged(to: string): void {
    if (to === 'training-workout') {
      this.workout = null;
      const id = this.$route.params.id;
      this.workout = (this.$store.getters.latestWorkouts || []).filter(
        (x: IWorkout) => x._id === id
      )[0];
      if (!this.workout) {
        axios.get('workout/' + id).then(res => (this.workout = res.data));
      }
    }
  }

  get categoryInfo(): {
    title: string;
    thumbnail: string;
  } {
    let title = 'Training';
    let thumbnail = '1549060279-7e168fcee0c2';
    if (this.$route.name === 'training-muscle') {
      title = muscles.filter(
        x => x.toLowerCase() === this.$route.params.muscle.toLowerCase()
      )[0];
    } else if (this.$route.name === 'training-wiki') {
      title = 'Trainings Wiki';
      thumbnail = '1571019614242-c5c5dee9f50b';
    } else if (this.$route.name === 'training-workout' && this.workout) {
      title = this.workout.title;
    }
    return {
      title: title,
      thumbnail: `https://images.unsplash.com/photo-${thumbnail}?w=1080&q=5`
    };
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
</style>
