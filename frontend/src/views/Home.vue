<template>
  <div class="home">
    <tc-hero></tc-hero>
    <div content>
      <template v-if="$store.getters.valid">
        <h1>Welcome back,</h1>
        <h2>{{ $store.getters.name || 'Champion' }}</h2>
      </template>
      <h1 v-else>Home</h1>
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
