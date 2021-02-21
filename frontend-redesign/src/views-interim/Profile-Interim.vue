<template>
  <div class="interim-profile">
    <tc-hero
      :dark="$store.getters.darkmode"
      :hasFixedHeader="$store.getters.isDesktop"
    >
      <img src="assets/hero/profile.webp" slot="background" alt="" />
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
export default class InterimProfile extends Vue {}
</script>
