<template>
  <div class="interim-training">
    <FHHeader
      :backTitle="$route.meta.backTitle || 'Training'"
      :rootRoute="$route.meta.backRoute || 'training'"
      :title="$route.params.muscle || $route.meta.hero"
    />

    <tc-hero
      :dark="$store.getters.darkmode"
      :hasFixedHeader="$store.getters.isDesktop"
    >
      <img src="assets/hero/training.webp" slot="background" alt="" />
      <h1 center>{{ $route.params.muscle || $route.meta.hero }}</h1>
    </tc-hero>
    <FHRouter />
  </div>
</template>

<script lang="ts">
import FHHeader from '@/components/FHHeader.vue';
import FHRouter from '@/components/FHRouter.vue';
import backend from '@/utils/backend';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHRouter,
    FHHeader
  }
})
export default class InterimTraining extends Vue {
  mounted() {
    this.loadTrendingExercises();
    this.loadLatestExercises();
    this.loadLatestWorkouts();
  }

  public async loadTrendingExercises(): Promise<void> {
    if (!this.$store.getters.trendingExercises) {
      const { data } = await backend.get('exercise/trending');
      this.$store.commit('trendingExercises', data);
    }
  }

  public async loadLatestExercises(): Promise<void> {
    if (!this.$store.getters.latestExercises) {
      const { data } = await backend.get('exercise/latest');
      this.$store.commit('latestExercises', data);
    }
  }

  public async loadLatestWorkouts(): Promise<void> {
    if (!this.$store.getters.latestWorkouts) {
      const { data } = await backend.get('workout/latest');
      this.$store.commit('latestWorkouts', data);
    }
  }
}
</script>

<style lang="scss" scoped>
.interim-training {
  .tc-hero {
    color: #fff;
    h1 {
      padding-top: env(safe-area-inset-top);
    }
  }
}
</style>
