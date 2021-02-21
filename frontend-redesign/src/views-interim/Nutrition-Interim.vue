<template>
  <div class="interim-nutrition">
    <tc-hero
      :dark="true || $store.getters.darkmode"
      :hasFixedHeader="$store.getters.isDesktop"
    >
      <img src="assets/hero/nutrition.webp" slot="background" alt="" />
      <h1 center>{{ $route.params.category || $route.meta.hero }}</h1>
    </tc-hero>
    <FHRouter />
  </div>
</template>

<script lang="ts">
import FHRouter from '@/components/FHRouter.vue';
import backend from '@/utils/backend';
import { Vue, Component } from 'vue-property-decorator';
@Component({
  components: {
    FHRouter
  }
})
export default class InterimNutrition extends Vue {
  public mounted() {
    this.loadLatestRecipes();
    this.loadBelovedRecipes();
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
}
</script>
