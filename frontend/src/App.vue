<template lang="html">
  <div>
    <div id="mobile">
      <tc-header title="Fitness Planner" :autoBackground="true" />
      <tc-tabbar>
        <tc-tabbar-item routeName="home" icon="house" title="Start" />
        <tc-tabbar-item routeName="community" icon="users" title="Community" />
        <tc-tabbar-item
          v-if="$store.getters.valid"
          routeName="profile"
          icon="user"
          title="Profil"
        />
        <tc-tabbar-item v-else routeName="login" icon="user" title="Profil" />
        <tc-tabbar-item routeName="nutrition" icon="apple" title="Ernährung" />
        <tc-tabbar-item routeName="search" icon="lens" title="Suche" />
      </tc-tabbar>
    </div>
    <div id="desktop">
      <tc-navbar>
        <b slot="logo"><i class="ti-gym" /> Fitness Planner</b>
        <tc-navbar-item routeName="home" icon="house" name="Start" />
        <tc-navbar-item routeName="community" icon="users" name="Community" />
        <tc-navbar-item routeName="nutrition" icon="apple" name="Ernährung" />
        <tc-navbar-item routeName="search" icon="lens" name="Suche" />
        <template slot="actions">
          <tc-button
            v-if="$store.getters.valid"
            name="Profil"
            routeName="profile"
          />
          <tc-button v-else name="Profil" icon="user" routeName="login" />
        </template>
      </tc-navbar>
    </div>

    <div class="view">
      <transition
        name="fade"
        mode="out-in"
        @beforeLeave="beforeLeave"
        @enter="enter"
        @afterEnter="afterEnter"
        >>
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  public prevHeight = '0';

  beforeLeave(element: HTMLElement) {
    this.prevHeight = getComputedStyle(element).height;
  }

  enter(element: HTMLElement) {
    const { height } = getComputedStyle(element);
    element.style.height = this.prevHeight;
    setTimeout(() => {
      element.style.height = height;
    });
  }

  afterEnter(element: HTMLElement) {
    element.style.height = 'auto';
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
}

body {
  margin: 0;
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
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
