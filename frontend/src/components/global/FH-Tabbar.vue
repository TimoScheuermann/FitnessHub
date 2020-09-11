<template>
  <tc-tabbar
    class="fh-tabbar"
    :dark="$store.getters.darkmode"
    :key="$store.getters.darkmode"
  >
    <tc-tabbar-item
      tfcolor="success"
      routeName="home"
      icon="house"
      title="Home"
    />
    <tc-tabbar-item
      tfcolor="success"
      routeName="community"
      icon="users"
      title="Feed"
    />
    <tc-badge
      v-if="$store.getters.valid"
      :value="$store.getters.totalNotifications"
    >
      <tc-tabbar-item
        tfcolor="success"
        routeName="profile"
        icon="user"
        title="Profil"
      />
    </tc-badge>
    <tc-tabbar-item
      tfcolor="success"
      v-else
      routeName="login"
      icon="user"
      title="Profil"
    />
    <tc-tabbar-item
      tfcolor="success"
      routeName="training"
      icon="gym"
      title="Training"
    />
    <tc-tabbar-item
      tfcolor="success"
      routeName="nutrition"
      icon="apple-alt"
      title="Ernährung"
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
    display: none;
  }
}
</style>
