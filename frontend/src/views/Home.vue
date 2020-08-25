<template>
  <div class="home" content>
    <h1>Home</h1>
    <p>User valid: {{ $store.getters.valid }}</p>
    <p>User: {{ $store.getters.user }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Home extends Vue {}
</script>

<style lang="scss" scoped></style>
