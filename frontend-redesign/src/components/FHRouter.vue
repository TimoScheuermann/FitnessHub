<template>
  <div class="fh-router">
    <transition :name="transitionName" :mode="transitionMode">
      <router-view :fullscreen="$route.meta.fullscreen" class="sub-view" />
    </transition>
  </div>
</template>

<script lang="ts">
import { getDepth } from '@/utils/functions';
import { Vue, Component } from 'vue-property-decorator';
import { Route } from 'vue-router';
@Component
export default class FHRouter extends Vue {
  public transitionName = 'slide-bottom';
  public transitionMode: string | null = 'out-in';

  created() {
    this.$router.beforeEach((to: Route, from: Route, next: Function) => {
      const toDepth = getDepth(to);
      const fromDepth = getDepth(from);
      const toPath = to.fullPath.split('/').slice(0, 2);
      const fromPath = from.fullPath.split('/').slice(0, 2);

      this.transitionMode = null;
      if (to.meta.fullscreen) {
        this.transitionMode = 'in-out';
        this.transitionName = 'slide-fullscreen';
      } else if (from.meta.fullscreen) {
        this.transitionMode = 'in-out';
        this.transitionName = 'slide-fullscreen';
      } else if (fromPath.join('/') !== toPath.join('/')) {
        this.transitionMode = null;
        this.transitionName = 'slide-bottom';
      } else {
        this.transitionMode = null;
        this.transitionName =
          toDepth < fromDepth ? 'slide-right' : 'slide-left';
      }
      next();
    });
  }
}
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

.slide-bottom-enter-active,
.slide-bottom-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.slide-fullscreen-leave-to,
.slide-fullscreen-enter {
  opacity: 0;
  transform: translate(0, 100%);
  border-radius: 50vw;
}
.slide-fullscreen-enter {
  z-index: 12;
}

.fh-router {
  position: relative;
  max-width: 100vw;
  .sub-view {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 10;

    background-color: $background;
    @media #{$isDark} {
      background-color: $background_dark;
    }

    &[fullscreen] {
      transition: all 0.71s cubic-bezier(0.55, 0, 0.1, 1);
      z-index: 11;
    }
  }
}
</style>
