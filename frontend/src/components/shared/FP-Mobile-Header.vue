<template>
  <div
    class="fp-mobile-header"
    :class="{ enhancedVisibility: this.enhancedVisibility }"
  >
    <slot />
    <div v-if="enhancedVisibility" class="fp-mobile-header--title">
      {{ title }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class FPMobileHeader extends Vue {
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
.fp-mobile-header {
  @media #{$isDesktop} {
    display: none;
  }
  height: 50px;
  padding-top: env(safe-area-inset-top);
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
  padding: 0 5vw;
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
</style>
