<template>
  <div class="view-community" content>
    <div max-width>
      <tl-flow v-if="!posts" flow="column">
        <br />
        <tc-spinner :dark="$store.getters.darkmode" size="20" />
        <p>Posts werden geladen</p>
      </tl-flow>

      <tl-flow v-else-if="posts.length === 0" flow="column">
        <br />
        <i huge success class="ti-star"></i>
        <p>Zurzeit existieren noch keine Posts</p>
      </tl-flow>
      <masonry v-else :cols="{ default: 2, 600: 1 }" gutter="20px">
        <FHAdd />
        <FHFeedCard v-scroll-reveal v-for="p in posts" :key="p._id" :feed="p" />
      </masonry>

      <router-link
        v-group.admin.moderator
        :to="{ name: 'create-post' }"
        class="create-post-button"
      >
        <i class="ti-plus"></i>
      </router-link>

      <tl-flow flow="column" v-if="posts && loading">
        <br />
        <tc-spinner :dark="$store.getters.darkmode" size="20" />
        <p>Weitere Beiträge werden geladen</p>
        <br />
      </tl-flow>
      <p v-if="!canLoad" center style="opacity: .4">
        Du hast alle Beiträge geladen
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import FHFeedCard from '@/components/feed/FHFeedCard.vue';
import FHAdd from '@/components/FHAdd.vue';
import FHAppear from '@/components/FHAppear.vue';
import { FeedManagement } from '@/utils/FeedManagement';
import { IFeed } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear,
    FHFeedCard,
    FHAdd
  }
})
export default class Community extends Vue {
  public appending = false;

  mounted() {
    if (!this.posts) FeedManagement.loadPosts();
    FeedManagement.markAsRead();
    window.addEventListener('scroll', this.scrollListener);
  }

  beforeDestroy() {
    removeEventListener('scroll', this.scrollListener);
  }

  public async scrollListener() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 666) {
      this.$nextTick(() => {
        this.appendData();
      });
    }
  }

  get posts(): IFeed[] | null {
    return this.$store.getters.feed;
  }

  get loading(): boolean {
    return this.$store.getters.feedLoading;
  }

  get canLoad(): boolean {
    return this.$store.getters.canLoadPosts;
  }

  public async appendData(): Promise<void> {
    await FeedManagement.loadPosts();
  }
}
</script>

<style lang="scss" scoped>
.view-community {
  .create-post-button {
    position: fixed;
    z-index: 100;
    @media #{$isMobile} {
      bottom: calc(70px + env(safe-area-inset-bottom));
      right: 20px;
    }
    @media #{$isDesktop} {
      right: 5vw;
      bottom: 5vw;
    }

    border-radius: 40px;
    height: 40px;
    width: 40px;
    display: grid;
    place-content: center;
    background: $success;
    color: #fff;
    font-size: 30px;
    cursor: pointer;
    text-decoration: none;
    opacity: 0.5;
    transition: 0.2s ease-in-out;
    &:hover {
      opacity: 1;
    }

    animation: 0.2s appear 0.5s ease-in-out both;

    @keyframes appear {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }
  }
}
</style>
