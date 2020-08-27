<template>
  <div class="home">
    <tc-hero :height="$store.getters.valid ? 150 : 0">
      <h1>Welcome back,</h1>
      <h2>{{ $store.getters.name || 'Champion' }}</h2>
    </tc-hero>
    <div content>
      <h1>Home</h1>
      <tc-button name="test" @click="test"></tc-button>
      <p>output: {{ output }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getToken } from '@/utils/auth';

@Component
export default class Home extends Vue {
  public output: any = 'nothing';
  // http://localhost:3000/friends/test/abc
  public async test() {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };

    const res = await fetch(
      'http://localhost:3000/friends',
      options
    ).then(res => res.json());
    this.output = res;
  }
}
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
