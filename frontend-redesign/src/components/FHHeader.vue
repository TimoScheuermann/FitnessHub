<template>
  <div
    class="fh-header"
    transition
    :enhanced="this.enhanced"
    :fullscreen="$route.meta.fullscreen"
  >
    <tl-flow>
      <transition name="back-transition">
        <router-link
          class="back"
          transition
          v-if="!isRoot && backTitle"
          :key="backTitle"
          :to="{ name: rootRoute }"
        >
          <i class="ti-chevron-left" /> {{ backTitle }}
        </router-link>
      </transition>
    </tl-flow>
    <transition name="title-transition">
      <div :key="title" v-if="this.enhanced" class="title">{{ title }}</div>
    </transition>
    <tl-flow>
      <slot />
    </tl-flow>
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  min-height: 50px;
  padding: 0 5vw;
  padding-top: env(safe-area-inset-top);
  z-index: 1000;

  @media #{$isDesktop} {
    &:not([fullscreen]) {
      display: none;
    }
  }

  display: flex;
  justify-content: space-between;

  a.back {
    text-decoration: none;
    color: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      margin-right: 2.5px;
      font-size: 14px;
    }
  }

  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    line-height: 50px;
    font-weight: 600;
    font-size: 18px;
  }

  @include backdrop-blur($background);
  @media #{$isDark} {
    @include backdrop-blur($background_dark);
  }

  &:not([enhanced]) {
    background: transparent;
    backdrop-filter: saturate(100%) blur(0px);
  }

  &[enhanced] {
    a.back {
      color: $success;
    }
  }
}

.title-transition-enter,
.title-transition-leave-active {
  opacity: 0;
  transform: scale(0.8);
}
.title-transition-enter-active,
.title-transition-leave-active {
  transition: all 0.3s ease-in-out;
}

.back-transition-enter,
.back-transition-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.back-transition-enter-active,
.back-transition-leave-active {
  transition: all 0.3s ease-in-out;
}
</style>
