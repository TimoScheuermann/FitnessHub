<template>
  <div class="playground">
    <tc-hero>
      <h1>Playground</h1>
    </tc-hero>
    <div content></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Playground extends Vue {}
</script>

<style lang="scss" scoped></style>
