<template>
  <div class="management-interim">
    <fp-mobile-header :title="title">
      <tc-header-button routeName="profile" name="Profil" />
    </fp-mobile-header>
    <tc-hero :hasFixedHeader="fixedHeader" :height="200">
      <img
        src="https://images.unsplash.com/photo-1597075933405-a06cb4d6cecb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
        slot="background"
        alt=""
      />
      <h1>{{ title }}</h1>
    </tc-hero>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FPMobileHeader from '@/components/shared/FP-Mobile-Header.vue';

@Component({
  components: {
    'fp-mobile-header': FPMobileHeader
  }
})
export default class ManagementInterim extends Vue {
  public mq = window.matchMedia('(min-width: 851px)');
  public fixedHeader = this.mq.matches;

  mounted() {
    this.mq.addListener(this.mediaListener);
  }

  beforeDestroy() {
    this.mq.removeListener(this.mediaListener);
  }

  public mediaListener(event: MediaQueryListEvent): void {
    this.fixedHeader = event && event.matches;
  }

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
    color: #fff;
    text-transform: capitalize;
  }
}
// .tc-header-button {
//   position: absolute;
//   z-index: 10;
//   left: 5vw;
//   top: calc(20px + env(safe-area-inset-top));
// }
</style>
