<template>
  <transition-group
    class="fh-drag-list"
    tag="div"
    name="drag-list"
    :class="{ hasContent: $slots.default }"
  >
    <slot @positionChanged="positionChanged" />
  </transition-group>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHDragList extends Vue {
  public positionChanged(change: { from: number; to: number }): void {
    this.$emit('move-item', change);
  }
}
</script>

<style lang="scss" scoped>
.fh-drag-list {
  &.hasContent {
    padding: 5px;
  }
  border-radius: $border-radius;
  background: $paragraph;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
}

.user-list-move {
  transition: transform 0.5s;
}
.user-list-item {
  transition: all 0.5s;
}
.user-list-enter, .user-list-leave-to
/* .user-list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.user-list-leave-active {
  position: absolute;
}
</style>
