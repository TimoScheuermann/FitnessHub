<template>
  <FHPreview
    v-if="category"
    @click="handleClick"
    :height="110"
    :title="category.title"
  >
    <template slot="media">
      <img v-if="isImage" :src="category.thumbnail" alt="" />
      <video v-else playsinline autoplay="autoplay" loop muted>
        <source :src="category.thumbnail" />
      </video>
    </template>
  </FHPreview>
</template>

<script lang="ts">
import { IVariable } from '@/utils/interfaces';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import FHPreview from '../FHPreview.vue';

@Component({
  components: {
    FHPreview
  }
})
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

  activated() {
    this.categoryChanged();
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
