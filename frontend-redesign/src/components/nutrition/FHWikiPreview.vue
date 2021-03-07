<template>
  <div class="fh-wiki-preview" cursor v-if="title" @click="handleClick">
    <div class="media">
      <img :src="thumbnail" alt="" />
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script lang="ts">
import { openFullscreen } from '@/utils/functions';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class FHWikiPreview extends Vue {
  @Prop() title!: string;
  @Prop() thumbnail!: string;

  public handleClick(e: Event) {
    this.$emit('click', e);
    if (this.title) {
      openFullscreen('nutrition-wiki-item', {id:this.title})
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-wiki-preview {
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
    img {
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
