<template>
  <div class="fh-list">
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHList extends Vue {}
</script>

<style lang="scss" scoped>
.fh-list {
  padding: 5px;
  border-radius: $border-radius;

  background: $paragraph;
  @media #{$isDark} {
    background: $paragraph_dark;
  }
}
</style>
