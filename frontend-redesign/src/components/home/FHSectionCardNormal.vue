<template>
  <div class="fh-section-card-normal" :dark="$store.getters.darkmode">
    <div class="media" :style="backgroundStyle">
      <div class="asset" :style="assetStyle" />
    </div>
    <div class="container">
      <div class="title">{{ title }}</div>
      <div class="description">{{ description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHSectionCardNormal extends Vue {
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
.fh-section-card-normal {
  border-radius: $border-radius;
  background: $background;
  &[dark] {
    background: $background_dark;
  }
  .media {
    background-size: cover;
    height: 180px;
    padding: 10px 20px;
    .asset {
      background-size: contain;
      height: 100%;
    }
    &,
    .asset {
      background-position: center;
      background-repeat: no-repeat;
      border-radius: $border-radius $border-radius 0 0;
    }
  }
  .container {
    padding: 20px;
    text-align: left;
    .title {
      font-weight: bold;
      opacity: 0.5;
      margin-bottom: 10px;
    }
    .description {
      font-weight: 500;
    }
  }
}
</style>
