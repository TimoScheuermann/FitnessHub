<template>
  <div class="nutrition">
    <tc-hero :dark="true">
      <img
        src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
        slot="background"
        alt=""
      />
      <h1>Ernährung</h1>
    </tc-hero>
    <div content>
      <h1>Recent</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Nutrition extends Vue {}
</script>

<style lang="scss" scoped>
.tc-hero img {
  filter: brightness(80%);
}
</style>
