<template>
  <div class="fh-var-list">
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHVarList extends Vue {}
</script>

<style lang="scss" scoped>
.fh-var-list {
  margin: 0 -5px -5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
