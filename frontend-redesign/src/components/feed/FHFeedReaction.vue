<template>
  <div
    class="fh-feed-reaction"
    v-if="item && icon && reaction"
    @click="click"
    :class="{ reacted: hasReacted }"
  >
    <div>{{ icon }}</div>
    <div class="amount">{{ item[reaction] }}</div>
  </div>
</template>

<script lang="ts">
import { FeedManagement } from '@/utils/FeedManagement';
import { IFeed } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHFeedReaction extends Vue {
  @Prop() item!: IFeed;
  @Prop() icon!: string;
  @Prop() reaction!: string;

  get hasReacted(): boolean {
    if (!this.$store.getters.valid) return false;
    return (this.item.reactions || []).includes(this.reaction);
  }

  public click() {
    if (!this.$store.getters.valid) return;
    if (this.$route.name !== 'community') return;
    if (this.hasReacted) {
      FeedManagement.removeReaction(this.item._id, this.reaction);
    } else {
      FeedManagement.addReaction(this.item._id, this.reaction);
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-feed-reaction {
  background: rgba($color, 0.15);
  @media #{$isDark} {
    background: rgba($color_dark, 0.15);
  }

  cursor: pointer;

  opacity: 0.7;
  transition: 0.2s ease-in-out;
  &:hover {
    opacity: 1;
  }
  margin: 0 5px;
  width: max-content;
  padding: 5px;
  border-radius: inherit;

  display: inline-flex;
  justify-content: space-between;
  align-items: center;

  .amount {
    margin-left: 5px;
    font-size: 12px;
    font-weight: bold;
    opacity: 0.5;
  }

  &.reacted {
    opacity: 1;
    background: rgba($success, 0.5);
    color: #fff;
    .amount {
      opacity: 1;
    }
  }
}
</style>
