<template>
  <div class="management-interim">
    <fh-mobile-header :title="title">
      <tc-header-button routeName="profile" name="Profil" />
    </fh-mobile-header>
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
      <h1>{{ title }}</h1>
    </tc-hero>

    <transition :name="$store.getters.routeTransition">
      <router-view class="route-view route-sub-view" />
    </transition>
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
export default class ManagementInterim extends Vue {
  get title(): string {
    return (
      this.$route.meta.title ||
      this.$route.path
        .split('/')[2]
        .split('-')
        .join(' ')
    );
  }
}
</script>
<style lang="scss" scoped>
.tc-hero {
  img {
    filter: brightness(60%);
  }
  h1 {
    margin: 0px;
    margin-top: env(safe-area-inset-top);
    text-transform: capitalize;
  }
}

.route-sub-view {
  width: 90vw;
}
</style>
