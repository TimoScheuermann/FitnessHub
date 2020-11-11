<template>
  <div
    class="fh-navbar"
    :class="{
      enhancedVisibility: this.enhancedVisibility,
      dark: $store.getters.darkmode
    }"
  >
    <router-link :to="{ name: 'home' }" class="title">
      <b> <i class="ti-gym" />FitnessHub </b>
    </router-link>
    <tl-flow>
      <tc-navbar-item
        tfcolor="success"
        routeName="home"
        icon="house"
        name="Home"
      />
      <tc-navbar-item
        tfcolor="success"
        routeName="community"
        icon="users"
        name="Feed"
      />
      <tc-navbar-item
        tfcolor="success"
        routeName="training"
        icon="gym"
        name="Training"
      />
      <tc-navbar-item
        tfcolor="success"
        routeName="nutrition"
        icon="apple-alt"
        name="Ernährung"
      />
      <tc-badge
        v-if="$store.getters.valid"
        :value="$store.getters.totalNotifications"
        position="behind"
      >
        <tc-navbar-item
          tfcolor="success"
          routeName="profile"
          icon="user"
          name="Profil"
        />
      </tc-badge>
      <tc-navbar-item
        v-else
        tfcolor="success"
        routeName="login"
        icon="login"
        name="Login"
      />
    </tl-flow>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHNavbar extends Vue {
  public TRIGGER = 200;
  public enhancedVisibility = window.scrollY >= this.TRIGGER;

  mounted() {
    window.addEventListener('scroll', this.scrollListener);
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  /**
   * check if navbar should be highlighted
   */
  public scrollListener(): void {
    this.enhancedVisibility = window.scrollY >= this.TRIGGER;
  }
}
</script>

<style lang="scss" scoped>
.fh-navbar {
  @media #{$isMobile} {
    display: none;
  }
  min-height: 50px;
  padding: 0 5vw;
  padding-top: env(safe-area-inset-top);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
  .title {
    cursor: pointer;
    color: inherit;
    font-weight: 600;
    font-size: 1.2em;
    i {
      margin-right: 10px;
    }
  }
  color: #fff;

  background: rgba(0, 0, 0, 0.25);
  transition: background 0.2s ease-in-out;
  &.enhancedVisibility {
    color: $color;
    @include backdrop-blur($background);
    &.dark {
      color: $color_dark;
      @include backdrop-blur($background_dark);
    }
  }
}
</style>
