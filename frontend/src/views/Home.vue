<template>
  <div class="home">
    <fh-mobile-header title="Home" />
    <tc-hero
      :dark="true"
      :hasFixedHeader="$store.getters.fixedHeader"
      :height="200"
    >
      <img
        src="https://images.unsplash.com/photo-1597075933405-a06cb4d6cecb?q=25"
        slot="background"
        alt=""
      />
      <h1 v-if="!$store.getters.valid"><i class="ti-gym"></i> FitnessHub</h1>
      <h1 v-else>
        Welcome back, {{ $store.getters.user.givenName }}
        {{ $store.getters.user.familyName }}
      </h1>
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
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.tc-hero img {
  filter: brightness(60%);
}
</style>
