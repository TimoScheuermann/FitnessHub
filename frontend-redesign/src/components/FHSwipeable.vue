<template>
  <div
    class="fh-Swipeable"
    :style="{ 'margin-top': -offsetY + 'px' }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHSwipeable extends Vue {
  public xDown: number | null = null;
  public yDown: number | null = null;

  public offsetY = 0;

  public handleTouchEnd() {
    this.offsetY = 0;
  }

  public handleTouchStart(e: TouchEvent) {
    const firstTouch = e.touches[0];
    this.xDown = firstTouch.clientX;
    this.yDown = firstTouch.clientY;
  }

  public handleTouchMove(e: TouchEvent) {
    if (!this.xDown || !this.yDown) return;
    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    let xDiff = this.xDown - xUp;
    let yDiff = this.yDown - yUp;

    this.offsetY = yDiff;

    if (Math.abs(xDiff) < 100) xDiff = 0;
    if (Math.abs(yDiff) < 100) yDiff = 0;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        this.$emit('swipeLeft');
      } else if (xDiff < 0) {
        this.$emit('swipeRight');
      }
    } else {
      if (yDiff > 0) {
        this.$emit('swipeUp');
      } else if (yDiff < 0) {
        this.$emit('swipeDown');
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
