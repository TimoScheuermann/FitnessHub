<template>
  <div class="fh-router">
    <transition :name="$store.getters.routeTransition">
      <router-view class="sub-view" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class FHRouter extends Vue {}
</script>

<style lang="scss" scoped>
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(60px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-60px, 0);
}
.slide-bottom-enter {
  opacity: 0;
  transform: translate(0, 100px);
}
.slide-fullscreen-enter {
  opacity: 0;
  transform: translate(0, 100%);
}

.fh-router {
  position: relative;
  max-width: 100vw;
  .sub-view {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 10;
    background: $background;
    @media #{$isDark} {
      background: $background_dark;
    }
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }
}
</style>
