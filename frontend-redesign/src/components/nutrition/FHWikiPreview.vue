<template>
  <FHPreview v-if="title" :title="title" @click="handleClick" :height="110">
    <img slot="media" :src="thumbnail" alt="" />
  </FHPreview>
</template>

<script lang="ts">
import { openFullscreen } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHPreview from '../FHPreview.vue';

@Component({
  components: {
    FHPreview
  }
})
export default class FHWikiPreview extends Vue {
  @Prop() title!: string;
  @Prop() thumbnail!: string;

  public handleClick(e: Event) {
    this.$emit('click', e);
    if (this.title) {
      openFullscreen('nutrition-wiki-item', { id: this.title });
    }
  }
}
</script>
