<template>
  <div class="fh-category-preview" cursor v-if="category" @click="handleClick">
    <div class="media">
      <img v-if="isImage" :src="category.thumbnail" alt="" />
      <video v-else playsinline autoplay="autoplay" loop muted>
        <source :src="category.thumbnail" />
      </video>
    </div>
    <div class="title">{{ category.title }}</div>
  </div>
</template>

<script lang="ts">
import { IVariable } from '@/utils/interfaces';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class FHCategoryPreview extends Vue {
  @Prop() category!: IVariable;

  @Watch('category')
  categoryChanged() {
    if (!this.isImage) {
      setTimeout(() => {
        document.getElementsByTagName('video')[0].play();
      }, 100);
    }
  }

  public handleClick(e: Event) {
    this.$emit('click', e);
    if (this.category) {
      this.$router.push({
        name: 'recipe-category',
        params: { category: this.category.title }
      });
    }
  }

  get isImage(): boolean {
    if (!this.category) return false;
    return !this.category.thumbnail.endsWith('.mp4');
  }
}
</script>

<style lang="scss" scoped>
.fh-category-preview {
  border-radius: $border-radius;
  width: 280px;
  height: fit-content;

  background: $paragraph;
  @media #{$isDark} {
    background: $color;
  }
  box-shadow: $shadow-light;

  .media {
    height: 110px;
    img,
    video {
      width: 280px;
      height: 100%;
      object-fit: cover;
      border-radius: $border-radius $border-radius 0 0;
    }
  }

  .title {
    border-radius: 0 0 $border-radius $border-radius;
    margin-top: -12.5px;
    position: relative;
    padding: 0 20px 20px;
    overflow-wrap: break-word;
    font-weight: bold;
    font-size: 1.4em;

    background-image: linear-gradient(
      to bottom,
      transparent,
      $paragraph 12.5px
    );
    @media #{$isDark} {
      background-image: linear-gradient(to bottom, transparent, $color 12.5px);
    }
  }
}
</style>
