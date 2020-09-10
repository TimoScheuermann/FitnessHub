<template>
  <div class="fh-feature-card">
    <div class="fh-feature-card--title">{{ title }}</div>
    <div class="fh-feature-card--description">
      <slot />
    </div>
    <div class="fh-feature-card--image">
      <img :src="image" alt="" />
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
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
  padding: 20px;
  border-radius: $border-radius;
  display: flex;
  flex-direction: column;
  .fh-feature-card--title {
    font-weight: bold;
    color: $success;
  }
  .fh-feature-card--description {
    font-size: 20px;
    font-weight: 500;
    margin: 12px 0;
  }
  .fh-feature-card--image {
    flex-grow: 1;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      filter: drop-shadow(4px 8px 10px rgba(#111, 0.2));
    }
  }
}
</style>
