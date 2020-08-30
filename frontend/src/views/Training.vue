<template>
  <div class="training">
    <fh-mobile-header title="Training" />
    <tc-hero
      :dark="true"
      :hasFixedHeader="$store.getters.fixedHeader"
      :height="200"
    >
      <img
        src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=25"
        slot="background"
        alt=""
      />
      <h1>Training</h1>
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
export default class Training extends Vue {}
</script>

<style lang="scss" scoped></style>
