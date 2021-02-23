<template>
  <div class="interim-home">
    <tc-hero
      :dark="$store.getters.darkmode"
      :hasFixedHeader="$store.getters.isDesktop"
    >
      <img src="assets/hero/home.webp" slot="background" alt="" />
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
