<template>
  <div class="interim-community">
    <FHHeader
      :backTitle="$route.meta.backTitle || 'Feed'"
      :rootRoute="$route.meta.backRoute || 'community'"
      :title="$route.meta.hero"
    />

    <tc-hero
      :dark="$store.getters.darkmode"
      :hasFixedHeader="$store.getters.isDesktop"
    >
      <img src="assets/hero/community.webp" slot="background" alt="" />
      <h1 center>{{ $route.meta.hero }}</h1>
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
export default class InterimCommunity extends Vue {}
</script>

<style lang="scss" scoped>
.interim-community {
  .tc-hero {
    color: #fff;
    h1 {
      padding-top: env(safe-area-inset-top);
    }
  }
}
</style>
