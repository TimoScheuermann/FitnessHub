<template>
  <div
    ref="FHMobileHeader"
    class="fh-mobile-header"
    :class="{
      enhancedVisibility: enhancedVisibility,
      dark: $store.getters.darkmode,
      profileSidebar: profileSidebarVisisble
    }"
  >
    <div class="main-content">
      <slot />
      <transition name="fade">
        <div v-if="enhancedVisibility" class="fh-mobile-header--title">
          {{ title }}
        </div>
      </transition>
      <transition name="fade2">
        <div v-if="enhancedVisibility" class="fh-mobile-header--right">
          <slot name="right" />
        </div>
      </transition>
    </div>
    <div class="input-content" v-if="$slots.input">
      <slot name="input" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHMobileHeader extends Vue {
  @Prop() title!: string;

  public TRIGGER = 100;
  public enhancedVisibility = window.scrollY >= this.TRIGGER;

  get profileSidebarVisisble() {
    return (
      this.$route.name !== 'profile' &&
      this.$store.getters.valid &&
      this.$store.getters.isFullscreen
    );
  }

  beforeMount() {
    document.querySelectorAll('.view-wrapper').forEach(elem => {
      elem.addEventListener('scroll', () => this.scrollListener(elem));
    });
  }

  beforeDestroy() {
    document.querySelectorAll('.view-wrapper').forEach(elem => {
      elem.removeEventListener('scroll', () => this.scrollListener(elem));
    });
  }

  public scrollListener(elem: Element): void {
    this.enhancedVisibility = elem.scrollTop >= this.TRIGGER;
  }
}
</script>

<style lang="scss" scoped>
.fh-mobile-header {
  padding: 0 5vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  @media #{$isDesktop} {
    left: 210px;
  }
  &.profileSidebar {
    right: 315px;
  }

  z-index: 900;
  &.dark &--right,
  &.dark &--title {
    color: $color_dark;
  }
  .main-content {
    padding-top: env(safe-area-inset-top);
    display: flex;
    align-items: center;
    position: relative;
    height: 50px;
    .tc-header-button {
      color: #fff;
      transition: 0.2s ease-in-out;
    }
  }
  .input-content {
    display: none;
    padding-bottom: 10px;
  }

  &--title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 700;
    color: $color;
    font-size: 1.2em;
    text-transform: capitalize;
    white-space: nowrap;
  }
  &--right {
    position: absolute;
    right: 5vw;
  }
  transition: background 0.2s ease-in-out;
  &.enhancedVisibility {
    .input-content {
      display: block;
    }
    // @media #{$isMobile} {
    .tc-header-button {
      color: $success;
    }
    @include backdrop-blur($background);
    &.dark {
      @include backdrop-blur($background_dark);
    }
    // }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  margin-top: -50px;
}
.fade2-enter-active,
.fade2-leave-active {
  transition: all 0.3s ease;
}
.fade2-enter,
.fade2-leave-to {
  opacity: 0;
  margin-right: -50px;
}
</style>
