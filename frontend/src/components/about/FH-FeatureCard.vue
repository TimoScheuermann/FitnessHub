<template>
  <div class="fh-feature-card">
    <div class="fh-feature-card--image">
      <img :src="image" alt="" />
    </div>
    <div class="fh-feature-card--container">
      <div class="fh-feature-card--title">{{ title }}</div>
      <div class="fh-feature-card--description">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHFeatureCard extends Vue {
  @Prop() title!: string;
  @Prop() image!: string;
}
</script>

<style lang="scss" scoped>
.fh-feature-card {
  background: $paragraph;
  width: calc(90vw - 20px);
  max-width: 400px;
  @media #{$isDesktop} {
    max-width: 300px;
  }
  margin: 10px;

  box-shadow: $shadow-light;
  @media (prefers-color-scheme: dark) {
    background: $container_dark;
    box-shadow: $shadow;
  }
  border-radius: $border-radius;
  height: fit-content;
  .fh-feature-card--container {
    padding: 20px;
    background: $background;
    @media (prefers-color-scheme: dark) {
      background: $paragraph_dark;
    }
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0px -8px 20px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 $border-radius $border-radius;
    text-align: center;
    .fh-feature-card--title {
      font-weight: 600;
      font-size: 21px;
      // color: $success;
    }
    .fh-feature-card--description {
      margin-top: 12px;
      font-size: 17px;
      font-weight: 600;
      opacity: 0.75;
    }
  }
  .fh-feature-card--image {
    height: 160px;
    padding: 20px;
    margin-bottom: -50px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: top center;
      filter: drop-shadow(8px 8px 5px rgba(#111, 0.2));
    }
  }
}
</style>
