<template>
  <div class="community">
    <fh-mobile-header title="Community" />
    <tc-hero :dark="true" :hasFixedHeader="false" :height="200">
      <img
        src="https://images.unsplash.com/photo-1580086319619-3ed498161c77?q=25"
        slot="background"
        alt=""
      />
      <h1>Community</h1>
    </tc-hero>

    <div content>
      <h1>Beiträge</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Community extends Vue {}
</script>

<style lang="scss" scoped>
.community {
  .tc-hero {
    h1 {
      margin: 0px;
      margin-top: env(safe-area-inset-top);
      text-transform: capitalize;
    }
  }
}
</style>
