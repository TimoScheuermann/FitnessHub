<template>
  <div class="fh-carousel" ref="carousel">
    <slot />
    <div class="fh-carousel__spacer" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHCarousel extends Vue {}
</script>

<style lang="scss" scoped>
.fh-carousel {
  margin: 20px -5vw 0;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;

  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  // @include custom-scrollbar__light();
  @media (prefers-color-scheme: dark) {
    // @include custom-scrollbar__dark();
  }
  &::-webkit-scrollbar {
    display: none;
  }
  .fh-carousel__spacer {
    flex-shrink: 0;
    width: 5vw;
  }
  & > * {
    width: 250px;
    margin-left: 30px;
    scroll-snap-align: center;
    flex-shrink: 0;
    &:first-child {
      margin-left: 5vw;
    }
  }
}
</style>
