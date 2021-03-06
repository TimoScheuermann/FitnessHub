<template>
  <FHFeedItemWrapper
    v-if="item"
    :bgImage="item.thumbnail"
    :user="user"
    :timestamp="item.timestamp"
  >
    <div class="fh-feed-item-fh-update">
      <tl-grid gap="20">
        <div class="image" v-if="item.thumbnail">
          <img :src="item.thumbnail" />
        </div>
        <div class="info">
          <h2 v-if="item.title" :bg="!!item.thumbnail">{{ item.title }}</h2>
          <p>{{ item.text }}</p>
        </div>
      </tl-grid>
    </div>
  </FHFeedItemWrapper>
</template>

<script lang="ts">
import { fhBotId } from '@/utils/constants';
import { IFeedItem, IUserInfo } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHFeedItemWrapper from './FHFeedItemWrapper.vue';

@Component({
  components: {
    FHFeedItemWrapper
  }
})
export default class FHFeedItemFHUpdate extends Vue {
  @Prop() item!: IFeedItem;

  public user: IUserInfo = {
    _id: fhBotId,
    username: 'FitnessHub',
    avatar: 'pwa/splash/manifest-icon-512.jpg'
  };
}
</script>

<style lang="scss" scoped>
.fh-feed-item-fh-update {
  .image img {
    border-radius: 10px;
    width: 100%;
    max-height: 200px;
    object-fit: cover;
  }
  .info {
    margin: 0 20px;
    h2[bg='true'] {
      margin-top: 0;
    }
  }
}
</style>
