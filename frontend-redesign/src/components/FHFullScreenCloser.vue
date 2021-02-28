<template>
  <div class="fh-full-screen-closer" cursor transition @click="handleClick">
    <i class="ti-cross-circle-filled" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHFullScreenCloser extends Vue {
  @Prop() prev!: string;

  public handleClick(e: MouseEvent): void {
    this.$emit('click', e);
    if (this.prev) this.$router.push({ name: this.prev });
  }
}
</script>

<style lang="scss" scoped>
.fh-full-screen-closer {
  font-size: 1.8em;
  opacity: 0.75;

  &:hover,
  &:active {
    opacity: 1;
  }
}
</style>
