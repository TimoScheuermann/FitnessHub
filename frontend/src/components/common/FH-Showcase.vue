<template>
  <div class="fh-showcase">
    <img :src="src" alt="" />
    <div class="fh-showcase--title">{{ title }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHShowcase extends Vue {
  @Prop() title!: string;
  @Prop() src!: string;
}
</script>

<style lang="scss" scoped>
.fh-showcase {
  position: relative;
  height: 75px;
  user-select: none;
  img {
    object-fit: cover;
    border-radius: $border-radius;
    height: 100%;
    width: 100%;
    filter: brightness(50%);
  }
  .fh-showcase--title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5em;
    font-weight: bold;
    color: #fff;
  }
}
</style>
