<template>
  <div v-if="category" @click="clicked" class="fh-category-preview">
    <video
      v-if="category.thumbnail.endsWith('.mp4')"
      playsinline
      autoplay="autoplay"
      loop
      muted
    >
      <source :src="category.thumbnail" />
    </video>
    <img v-else :src="category.thumbnail" alt="" />
    <div class="fh-category-preview--container">
      {{ category.title }}
    </div>
  </div>
</template>

<script lang="ts">
import { IVariable } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHCategoryPreview extends Vue {
  @Prop() category!: IVariable;
  @Prop() routeName!: string;
  @Prop({ default: false }) noLink!: boolean;

  mounted() {
    setTimeout(() => {
      document.getElementsByTagName('video')[0].play();
    }, 100);
  }

  public clicked(e: MouseEvent): void {
    if (!this.noLink) {
      if (this.routeName) {
        this.$router.push({ name: this.routeName });
      } else if (this.category) {
        this.$router.push({
          name: 'nutrition-category',
          params: { category: this.category.title }
        });
      }
    }
    this.$emit('click', e);
  }
}
</script>

<style lang="scss" scoped>
.fh-category-preview {
  cursor: pointer;
  position: relative;
  height: 200px;
  border-radius: $border-radius;
  color: inherit;
  img,
  video {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: $border-radius;
  }
  .fh-category-preview--container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 1.1em;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    padding: 10px 20px;
    border-radius: 0 0 $border-radius $border-radius;
    @include backdrop-blur($paragraph);
    @media (prefers-color-scheme: dark) {
      @include backdrop-blur($paragraph_dark);
    }
  }
}
</style>
