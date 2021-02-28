<template>
  <div class="interim-home">
    <FHHeader
      :backTitle="$route.meta.backTitle || 'Home'"
      :rootRoute="$route.meta.backRoute || 'home'"
      :title="$route.meta.hero"
    />

    <tc-hero
      :dark="$store.getters.darkmode"
      :hasFixedHeader="$store.getters.isDesktop"
    >
      <img src="assets/hero/home.webp" slot="background" alt="" />
      <h1>{{ $route.meta.hero }}</h1>
    </tc-hero>
    <FHRouter />
  </div>
</template>

<script lang="ts">
import FHHeader from '@/components/FHHeader.vue';
import FHRouter from '@/components/FHRouter.vue';
import { Vue, Component } from 'vue-property-decorator';
@Component({
  components: {
    FHRouter,
    FHHeader
  }
})
export default class InterimHome extends Vue {}
</script>

<style lang="scss" scoped>
.interim-home {
  .tc-hero {
    color: #fff;
    h1 {
      padding-top: env(safe-area-inset-top);
    }
  }
}
</style>
