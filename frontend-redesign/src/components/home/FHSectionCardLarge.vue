<template>
  <div class="fh-section-card-large" :style="backgroundStyle">
    <tl-grid minWidth="150">
      <div class="asset" :style="assetStyle" />
      <tl-flow flow="column" class="container" vertical="start">
        <div class="title">{{ title }}</div>
        <div class="description">{{ description }}</div>
      </tl-flow>
    </tl-grid>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHSectionCardLarge extends Vue {
  @Prop() background!: string;
  @Prop() asset!: string;
  @Prop() title!: string;
  @Prop() description!: string;
  @Prop() size!: 'large' | 'normal';

  get backgroundStyle(): string {
    const bg = this.background;
    if (!bg) return '';
    if (bg.startsWith('https')) return `background-image: url(${bg})`;
    if (bg.startsWith('background-image:')) return bg;
    if (bg.startsWith('background-color:')) return bg;
    return `background: ${bg}`;
  }

  get assetStyle(): string {
    if (!this.asset) return '';

    return `background-image: url(${this.asset})`;
  }
}
</script>
<style lang="scss" scoped>
.fh-section-card-large {
  grid-column: 1 / -1;
  border-radius: $border-radius;
  padding: 20px;
  background-size: cover;
  &,
  .asset {
    background-position: center;
    background-repeat: no-repeat;
  }
  .asset {
    height: 100%;
    min-height: 250px;
    background-size: contain;
  }
  .container {
    color: #fff;
    text-align: left;
    .title {
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .description {
      font-weight: 500;
    }
  }
}
</style>
