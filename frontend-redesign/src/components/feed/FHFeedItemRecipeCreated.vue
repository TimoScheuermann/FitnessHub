<template>
  <div class="fh-feed-item-recipe-created">
    <FHFeedItemWrapper>
      <tl-grid gap="20">
        <tc-image
          src="https://images.unsplash.com/photo-1565593427994-7d6d81690905?q=5&w=1080"
        />
        <div class="info">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit odio
          voluptas eius asperiores, debitis consectetur! Debitis, similique
          beatae obcaecati amet voluptatum dolorum accusamus iure ullam alias
          ipsa voluptatem dolores cupiditate!
        </div>
      </tl-grid>
    </FHFeedItemWrapper>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FHFeedItemWrapper from './FHFeedItemWrapper.vue';

@Component({
  components: {
    FHFeedItemWrapper
  }
})
export default class FHFeedItemRecipeCreated extends Vue {}
</script>

<style lang="scss" scoped>
.fh-feed-item-recipe-created {
  //
  img {
    border-radius: 10px;
  }
}
</style>
