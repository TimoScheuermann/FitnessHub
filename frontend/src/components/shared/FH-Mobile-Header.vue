<template>
  <div
    class="fh-mobile-header"
    :class="{ enhancedVisibility: this.enhancedVisibility }"
  >
    <slot />
    <transition name="fade">
      <div v-if="enhancedVisibility" class="fh-mobile-header--title">
        {{ title }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHMobileHeader extends Vue {
  @Prop() title!: string;

  public TRIGGER = 100;
  public enhancedVisibility = window.scrollY >= this.TRIGGER;

  mounted() {
    window.addEventListener('scroll', this.scrollListener);
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  public scrollListener(): void {
    this.enhancedVisibility = window.scrollY >= this.TRIGGER;
  }
}
</script>

<style lang="scss" scoped>
.fh-mobile-header {
  @media #{$isDesktop} {
    display: none;
  }
  // background: red;
  min-height: 50px;
  padding: 0 5vw;
  padding-top: env(safe-area-inset-top);
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
  &--title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 700;
    color: $color;
    font-size: 1.2em;
    text-transform: capitalize;
  }
  .tc-header-button {
    color: #fff;
    transition: 0.2s ease-in-out;
  }
  transition: background 0.2s ease-in-out;
  &.enhancedVisibility {
    .tc-header-button {
      color: $primary;
    }
    @include backdrop-blur($background);
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
</style>