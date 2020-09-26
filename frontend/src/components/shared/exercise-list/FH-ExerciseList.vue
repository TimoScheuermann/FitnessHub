<template>
  <div class="fh-exercise-list" v-if="$slots.default">
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class FHExerciseList extends Vue {}
</script>

<style lang="scss" scoped>
.fh-exercise-list {
  padding: 5px;
  user-select: none;
  border-radius: $border-radius;
  background: $paragraph;

  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
}
</style>
