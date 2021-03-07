<template>
  <FHFeedItemWrapper
    v-if="item"
    :bgImage="item.thumbnail"
    :user="item.user"
    :timestamp="item.timestamp"
  >
    <div class="fh-feed-item-recipe-created">
      <tl-grid gap="20">
        <div class="image" v-if="item.thumbnail">
          <img :src="item.thumbnail" />
        </div>
        <div class="info">
          <h2 v-if="item.title">{{ item.title }}</h2>
          <p>{{ item.text }}</p>
          <tc-link
            v-if="item.actionId"
            tfcolor="success"
            @click="$oFS('recipe-details', { id: item.actionId })"
          >
            Rezept ansehen
          </tc-link>
        </div>
      </tl-grid>
    </div>
  </FHFeedItemWrapper>
</template>

<script lang="ts">
import { IFeedItem } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHFeedItemWrapper from './FHFeedItemWrapper.vue';

@Component({
  components: {
    FHFeedItemWrapper
  }
})
export default class FHFeedItemRecipeCreated extends Vue {
  @Prop() item!: IFeedItem;
}
</script>

<style lang="scss" scoped>
.fh-feed-item-recipe-created {
  .image img {
    border-radius: $border-radius;
    width: 100%;
    max-height: 200px;
    object-fit: cover;
  }
  .info {
    margin: 0 20px;
    h2 {
      margin-top: 0;
    }
  }
}
</style>
