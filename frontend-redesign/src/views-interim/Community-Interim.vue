<template>
  <div class="interim-community">
    <tc-hero
      :dark="$store.getters.darkmode"
      :hasFixedHeader="$store.getters.isDesktop"
    >
      <img src="assets/hero/community.webp" slot="background" alt="" />
    </tc-hero>
    <FHRouter />
  </div>
</template>

<script lang="ts">
import FHRouter from '@/components/FHRouter.vue';
import { Vue, Component } from 'vue-property-decorator';
@Component({
  components: {
    FHRouter
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
