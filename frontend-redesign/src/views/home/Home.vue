<template>
  <div class="view-Home">
    <h1 v-for="(k, i) in Array(50)" :key="i">{{ i }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>

<style lang="scss" scoped></style>
