<template>
  <div class="community">
    <tc-hero :dark="true" tc-dark-container>
      <img
        src="https://images.unsplash.com/photo-1580086319619-3ed498161c77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
        slot="background"
        alt=""
      />
      <h1>Community</h1>
    </tc-hero>
    <div content>
      <h1>Beiträge</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Community extends Vue {}
</script>

<style lang="scss" scoped></style>
