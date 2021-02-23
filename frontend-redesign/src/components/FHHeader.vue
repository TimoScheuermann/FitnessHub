<template>
  <div class="fh-header" :class="{ 'fh-header__enhanced': enhanced }">
    <div
      class="fh-header--container"
      :class="{ dark: $store.getters.darkmode }"
    >
      {{ title }}
    </div>
    <router-link :to="{ name: rootRoute }" v-if="!isRoot">
      <i class="ti-chevron-left" /> {{ backTitle }}
    </router-link>
    <div class="slot">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class FHHeader extends Vue {
  @Prop() title!: string;
  @Prop() rootRoute!: string;
  @Prop() backTitle!: string;
  @Prop({ default: 100 }) trigger!: number;

  public TRIGGER = this.trigger;
  public enhanced = window.scrollY > this.TRIGGER;

  get isRoot(): boolean {
    if (!this.rootRoute) return true;
    return this.$route.name === this.rootRoute;
  }

  mounted() {
    window.addEventListener('scroll', this.scroll);
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.scroll);
  }

  public scroll() {
    this.enhanced = window.scrollY > this.TRIGGER;
  }
}
</script>

<style lang="scss" scoped>
.fh-header {
  .fh-header--container,
  a,
  .slot {
    position: fixed;
    text-transform: capitalize;
    transition: all 0.2s ease-in-out;
    line-height: 50px;
  }
  .fh-header--container {
    @include backdrop-blur($background);
    @media #{$isDark} {
      @include backdrop-blur($background_dark);
    }
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 0 5vw;
    padding-top: env(safe-area-inset-top);
    transform: translateY(calc(-50px - env(safe-area-inset-top)));
    font-weight: bold;
    text-align: center;
  }
  a {
    top: env(safe-area-inset-top);
    color: #fff;
    text-decoration: none;
    z-index: 101;
    left: 5vw;
  }
  .slot {
    top: env(safe-area-inset-top);
    z-index: 101;
    right: 5vw;
  }

  &.fh-header__enhanced {
    .fh-header--container {
      transform: translateY(0px);
    }
    a {
      color: $success;
    }
  }
}
</style>
