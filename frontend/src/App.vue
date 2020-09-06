<template>
  <div class="fitnesshub">
    <fh-navbar id="desktop" />
    <fh-tabbar id="mobile" />

    <div class="view">
      <transition name="main-route">
        <router-view class="child-view" />
      </transition>
    </div>
    <fh-notification />

    <div class="loading" v-if="$store.getters.loading">
      <tc-spinner :dark="$store.getters.darkmode" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import FHNavbar from './components/global/FH-Navbar.vue';
import SocketManager from '@/socketManager/SocketManager.mixin';
import FHNotification from './components/global/FH-Notification.vue';
import FHTabbar from './components/global/FH-Tabbar.vue';

@Component({
  components: {
    'fh-navbar': FHNavbar,
    'fh-tabbar': FHTabbar,
    'fh-notification': FHNotification
  }
})
export default class App extends Mixins(SocketManager) {
  public mqFixedHeader = window.matchMedia('(min-width: 851px)');
  public mqDarkmode = window.matchMedia('(prefers-color-scheme: dark)');

  async mounted() {
    this.mqFixedHeader.addListener(this.mediaListenerHeader);
    this.mqDarkmode.addListener(this.mediaListenerDarkmode);
    this.$store.commit('fixedHeader', this.mqFixedHeader.matches);
    this.$store.commit('darkmode', this.mqDarkmode.matches);
    document.documentElement.classList[
      this.mqDarkmode.matches ? 'add' : 'remove'
    ]('dark');
  }

  beforeDestroy() {
    this.mqFixedHeader.removeListener(this.mediaListenerHeader);
    this.mqDarkmode.removeListener(this.mediaListenerDarkmode);
  }

  public mediaListenerHeader(event: MediaQueryListEvent): void {
    this.$store.commit('fixedHeader', event && event.matches);
  }
  public mediaListenerDarkmode(event: MediaQueryListEvent): void {
    const matches = event && event.matches;
    document.documentElement.classList[matches ? 'add' : 'remove']('dark');
    this.$store.commit('darkmode', matches);
    this.$forceUpdate();
  }
}
</script>

<style lang="scss">
html {
  font-family: -apple-system, BlinkMacSystemFont, SF Pro Display, Inter,
    Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol;
  scroll-behavior: smooth;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;

  background: $background;
  color: $color;

  &.dark {
    background: $background_dark;
    color: $color_dark;
  }
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
}

a {
  text-decoration: none;
}

#mobile {
  @media #{$isDesktop} {
    display: none;
  }
}
#desktop {
  @media #{$isMobile} {
    display: none;
  }
}

[content] {
  padding: calc(20px + env(safe-area-inset-bottom)) 5vw {
    top: 0px;
  }
  @media #{$isMobile} {
    padding-bottom: calc(70px + env(safe-area-inset-bottom));
  }
}
.tc-tabbar {
  .tc-badge {
    flex: 1 1 0px;
    margin: 0 2.5px;
  }
}

.view {
  position: relative;
}
.child-view {
  position: absolute;
  right: 0;
  left: 0;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

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

.main-route-leave-active {
  opacity: 0;
  transform: scale(0.8);
}
.main-route-enter {
  opacity: 0;
  transform: scale(1.2);
}
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999999;
  animation: appear 0.5s ease 0.5s both;
  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

.fh-health-card {
  background: $paragraph;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
  padding: 10px;
  border-radius: $border-radius;
}
</style>
