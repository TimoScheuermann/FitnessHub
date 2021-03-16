<template>
  <div class="interim-nutrition">
    <FHHeader
      :backTitle="$route.meta.backTitle || 'Ernährung'"
      :rootRoute="$route.meta.backRoute || 'nutrition'"
      :title="$route.params.category || $route.meta.hero"
    />

    <tc-hero
      :dark="$store.getters.darkmode"
      :hasFixedHeader="$store.getters.isDesktop"
    >
      <img src="assets/hero/nutrition.webp" slot="background" alt="" />
      <h1 center>{{ $route.params.category || $route.meta.hero }}</h1>
    </tc-hero>
    <FHRouter />
  </div>
</template>

<script lang="ts">
import FHHeader from '@/components/FHHeader.vue';
import FHRouter from '@/components/FHRouter.vue';
import backend from '@/utils/backend';
import { Vue, Component } from 'vue-property-decorator';
import { NutritionplanManagement } from '@/utils/NutritionplanManagement';
@Component({
  components: {
    FHRouter,
    FHHeader
  }
})
export default class InterimNutrition extends Vue {
  public mounted() {
    this.loadLatestRecipes();
    this.loadBelovedRecipes();
    this.loadnutritionplans();
  }

  public async loadLatestRecipes(): Promise<void> {
    if (!this.$store.getters.latestRecipes) {
      const { data } = await backend.get('recipe/latest');
      this.$store.commit('latestRecipes', data);
    }
  }

  public async loadBelovedRecipes(): Promise<void> {
    if (!this.$store.getters.belovedRecipes) {
      const { data } = await backend.get('recipe/beloved');
      this.$store.commit('belovedRecipes', data);
    }
  }

  public loadnutritionplans(): void {
    NutritionplanManagement.loadPlans();
  }
}
</script>

<style lang="scss" scoped>
.interim-nutrition {
  .tc-hero {
    color: #fff;
    h1 {
      padding-top: env(safe-area-inset-top);
    }
  }
}
</style>
