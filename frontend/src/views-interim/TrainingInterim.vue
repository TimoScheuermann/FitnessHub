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
      v-if="$route.name !== 'workout-detail'"
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
    if (to === 'workout-detail') {
      this.workout = null;
      const id = this.$route.params.id;
      // console.log("Latest", this.$store.getters.latestWor)
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
    if (this.$route.name === 'training-muscle') {
      title = muscles.filter(
        x => x.toLowerCase() === this.$route.params.muscle.toLowerCase()
      )[0];
    }
    if (this.$route.name === 'workout-detail' && this.workout) {
      title = this.workout.title;
    }
    return {
      title: title,
      thumbnail:
        'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=5&w=1080'
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
