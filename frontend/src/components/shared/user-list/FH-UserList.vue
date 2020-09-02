<template>
  <transition-group
    class="fh-user-list"
    tag="div"
    name="user-list"
    :class="{ dark: $store.getters.darkmode, hasContent: $slots.default }"
  >
    <slot />
  </transition-group>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class FHUserList extends Vue {}
</script>

<style lang="scss" scoped>
.fh-user-list {
  &.hasContent {
    padding: 5px;
  }
  border-radius: $border-radius;
  background: $paragraph;

  &.dark {
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
