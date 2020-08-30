<template>
  <div class="nutrition">
    <fh-mobile-header title="Ernährung" />
    <tc-hero
      :dark="true"
      :hasFixedHeader="$store.getters.fixedHeader"
      :height="200"
    >
      <img
        src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=25"
        slot="background"
        alt=""
      />
      <h1>Ernährung</h1>
    </tc-hero>

    <div content>
      <h1>Title</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FHMobileHeader from '@/components/shared/FH-Mobile-Header.vue';

@Component({
  components: {
    'fh-mobile-header': FHMobileHeader
  }
})
export default class Nutrition extends Vue {}
</script>

<style lang="scss" scoped>
.tc-hero img {
  filter: brightness(80%);
}
</style>
