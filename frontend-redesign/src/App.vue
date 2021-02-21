<template>
  <div class="fitnesshub">
    <FHTabbar />
    <FHNavbar />
    <FHRouter />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FHNavbar from './components/FHNavbar.vue';
import FHRouter from './components/FHRouter.vue';
import FHTabbar from './components/FHTabbar.vue';
import {
  registerMediaQueries,
  unregisterMediaQueries
} from '@/utils/mediaQueries';
import { loadVariables } from './utils/functions';

@Component({
  components: {
    FHTabbar,
    FHNavbar,
    FHRouter
  }
})
export default class App extends Vue {
  mounted() {
    registerMediaQueries();
    loadVariables();
  }

  beforeDestroy() {
    unregisterMediaQueries();
  }
}
</script>

<style lang="scss">
html {
  font-family: -apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI,
    Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
    Segoe UI Symbol;
  scroll-behavior: smooth;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;

  background: $background;
  color: $color;
  @media #{$isDark} {
    background: $background_dark;
    color: $color_dark;
  }
  overflow-x: hidden;
}

body {
  margin: 0;
}

[class^='interim'] {
  min-height: 100vh;
}

[center] {
  text-align: center;
}

[error] {
  color: $error;
}
[success] {
  color: $success;
}

[huge] {
  font-size: 40px;
}

[content] {
  padding: 20px 5vw calc(20px + env(safe-area-inset-bottom));
  @media #{$isMobile} {
    padding-bottom: calc(70px + env(safe-area-inset-bottom));
    padding-left: calc(5vw + env(safe-area-inset-left));
    padding-right: calc(5vw + env(safe-area-inset-right));
  }
}

[max-width] {
  max-width: 800px;
  margin: 0 auto;
}

[line-break] {
  white-space: pre-line;
}

[cursor] {
  cursor: pointer;
}

[transition] {
  transition: all 0.2s ease-in-out;
}
</style>
