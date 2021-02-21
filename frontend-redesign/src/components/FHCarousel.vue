<template>
  <div class="fh-carousel">
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
  margin: 10px -5vw 20px;
  display: flex;
  overflow-x: auto;
  user-select: none;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
  .fh-carousel__spacer {
    flex-shrink: 0;
    width: 5vw !important;
  }
  & > * {
    max-width: 280px;
    margin-left: 30px;
    scroll-snap-align: center;
    flex-shrink: 0;
    &:first-child {
      margin-left: 5vw;
    }
  }
}
</style>
