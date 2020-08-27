<template>
  <div class="home">
    <tc-hero :height="$store.getters.valid ? 150 : 0">
      <h1>Welcome back,</h1>
      <h2>{{ $store.getters.name || 'Champion' }}</h2>
    </tc-hero>
    <div content>
      <h1>Home</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.tc-hero {
  h1,
  h2 {
    margin: 2.5px 0;
    text-align: center;
  }
}
</style>
