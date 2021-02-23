<template>
  <div class="fh-carousel">
    <div class="fh-carousel__fade" left />
    <div class="fh-carousel__spacer" />
    <slot />
    <div class="fh-carousel__spacer" />
    <div class="fh-carousel__fade" right />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class FHCarousel extends Vue {}
</script>

<style lang="scss" scoped>
.fh-carousel {
  margin: 10px -5vw 20px;
  display: flex;
  overflow-x: auto;
  user-select: none;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  position: relative;

  .fh-carousel__fade {
    position: sticky;
    top: 0;
    bottom: 0;
    z-index: 1000;
    width: 5vw;
    max-width: 45px;
    flex-shrink: 0;

    &[left] {
      left: 0;
      margin-left: -5vw;

      background: linear-gradient(
        to right,
        rgba($background, 1),
        rgba($background, 0)
      );
      @media #{$isDark} {
        background: linear-gradient(
          to right,
          rgba($background_dark, 1),
          rgba($background_dark, 0)
        );
      }
    }
    &[right] {
      right: 0;
      background: linear-gradient(
        to left,
        rgba($background, 1),
        rgba($background, 0)
      );
      @media #{$isDark} {
        background: linear-gradient(
          to left,
          rgba($background_dark, 1),
          rgba($background_dark, 0)
        );
      }
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }

  .fh-carousel__spacer {
    flex-shrink: 0;
    width: 5vw;
  }

  div:not([class^='fh-carousel']) {
    margin-left: 30px;
    scroll-snap-align: center;
    flex-shrink: 0;

    &:nth-child(3) {
      margin-left: 0px;
    }
  }
}
</style>
