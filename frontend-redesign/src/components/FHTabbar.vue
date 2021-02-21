<template>
  <tc-tabbar
    transition
    :moveout="$route.meta.fullscreen"
    :dark="$store.getters.darkmode"
  >
    <tc-tabbar-item
      tfcolor="success"
      icon="house"
      title="Start"
      routeName="home"
    />
    <tc-tabbar-item
      tfcolor="success"
      icon="star"
      title="Feed"
      routeName="community"
    />
    <tc-tabbar-item
      v-if="$store.getters.valid"
      tfcolor="success"
      icon="user-filled"
      title="Profil"
      routeName="profile"
    />
    <tc-tabbar-item
      v-else
      tfcolor="success"
      icon="login"
      title="Login"
      @click="$oFS('login')"
    />
    <tc-tabbar-item
      tfcolor="success"
      icon="gym"
      title="Training"
      routeName="training"
    />
    <tc-tabbar-item
      tfcolor="success"
      icon="apple-alt"
      title="Ernährung"
      routeName="nutrition"
    />
  </tc-tabbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHTabbar extends Vue {}
</script>

<style lang="scss" scoped>
.tc-tabbar {
  @media #{$isDesktop} {
    display: none !important;
  }
  &[moveout] {
    transform: translateY(calc(50px + env(safe-area-inset-bottom)));
  }
}
</style>
