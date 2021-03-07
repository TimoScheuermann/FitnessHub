<template>
  <div class="fh-large-headline">
    <div class="title">{{ title }}</div>
    <div class="subtitle">{{ subtitle }}</div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class FHLargeHeadline extends Vue {
  @Prop() title!: string;
  @Prop() subtitle!: string;
}
</script>
<style scoped lang="scss">
.fh-large-headline {
  margin-top: 90px;
  &::before {
    top: -110px;
    content: '';
    position: absolute;
    width: 3px;
    height: 100px;
    border-radius: 5px;
    opacity: 0.6;
    background: currentColor;
  }
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-weight: bold;
  .title,
  .subtitle {
    max-width: 100vw;
    text-align: center;
    overflow: hidden;
  }
  .title {
    opacity: 0.2;
    font-size: 3.8em;
  }
  .subtitle {
    font-size: 2em;
  }
}
</style>
