<template>
  <div class="fh-list">
    <transition-group name="slide">
      <slot />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHList extends Vue {}
</script>

<style lang="scss" scoped>
.fh-list {
  // padding: 5px;
  border-radius: $border-radius;

  // background: $paragraph;
  // @media #{$isDark} {
  //   background: $paragraph_dark;
  // }
}

.slide-move,
.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(0, 100%);
}
.slide-leave-to {
  transform: translate(0, -100%);
  opacity: 0;
}
</style>
