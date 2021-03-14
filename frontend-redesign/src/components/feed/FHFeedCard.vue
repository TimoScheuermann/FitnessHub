<template>
  <div class="fh-feed-card" v-if="feed">
    <div
      class="background"
      v-if="background"
      :style="`--background-url: url(${background})`"
    />
    <div class="content-wrapper">
      <div class="fh-feed-item--head">
        <tc-avatar :src="user.avatar" />
        <div class="info">
          <div class="name">{{ user.username }}</div>
          <div class="time">{{ time }}</div>
        </div>
        <tc-action
          v-group.admin.moderator
          v-if="user._id === fhBotId && $route.name === 'community'"
          :dark="$store.getters.darkmode"
        >
          <tc-action-item
            alarm
            title="Bearbeiten"
            icon="pencil"
            @click="editPost"
          />
          <tc-action-item
            error
            title="Löschen"
            icon="trashcan-alt"
            @click="deletePost"
          />
        </tc-action>
      </div>

      <div class="fh-feed-item--content">
        <tl-grid minWidth="200" gap="20">
          <div v-if="background">
            <img :src="background" alt="" />
          </div>
          <div>
            <h2 v-if="feed.achievementTitle">{{ feed.achievementTitle }}</h2>
            <h2 v-else-if="feed.title">{{ feed.title }}</h2>
            <p line-break>{{ feed.text }}</p>

            <tl-flow horizontal="space-between">
              <template v-if="feed.recipeId">
                <tc-link
                  tfcolor="success"
                  @click="$oFS('recipe-details', { id: feed.recipeId })"
                >
                  Rezept ansehen
                </tc-link>
              </template>
              <template v-if="feed.exerciseId">
                <tc-link
                  tfcolor="success"
                  @click="$oFS('exercise-details', { id: feed.exerciseId })"
                >
                  Übung ansehen
                </tc-link>
                <tc-link tfcolor="success" @click="addTW">
                  + Workout
                </tc-link>
              </template>
            </tl-flow>
          </div>
        </tl-grid>
      </div>

      <div class="fh-feed-item--footer">
        <FHFeedReaction icon="🔥" :item="feed" reaction="hot" />
        <FHFeedReaction icon="❤️" :item="feed" reaction="like" />
        <FHFeedReaction icon="💪" :item="feed" reaction="strong" />
        <FHFeedReaction icon="👍" :item="feed" reaction="thumbsup" />
        <FHFeedReaction icon="🙉" :item="feed" reaction="monkey" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import backend from '@/utils/backend';
import { fhBotId, months } from '@/utils/constants';
import { ExerciseManagement } from '@/utils/ExerciseManagement';
import { FeedManagement } from '@/utils/FeedManagement';
import { IFeed, IUserInfo } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';
import FHFeedReaction from './FHFeedReaction.vue';

@Component({
  components: {
    FHFeedReaction
  }
})
export default class FHFeedCard extends Vue {
  @Prop() feed!: IFeed;

  public fhBotId = fhBotId;

  get user(): IUserInfo {
    return (
      this.feed.user || {
        _id: fhBotId,
        username: 'FitnessHub',
        avatar: 'pwa/splash/manifest-icon-192.jpg'
      }
    );
  }

  get background(): string | null {
    if (!this.feed) return null;
    if (this.feed.achievementTitle) {
      return 'assets/achievement-unlocked.webp';
    } else if (this.feed.thumbnail) {
      return this.feed.thumbnail;
    }
    return null;
  }

  get time(): string {
    const date = new Date(this.feed.timestamp);
    const cY = new Date().getFullYear();
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = ('00' + date.getHours()).slice(-2);
    const mins = ('00' + date.getMinutes()).slice(-2);
    return `am ${day}. ${month} ${
      year !== cY ? year : ''
    } um ${hours}:${mins} Uhr`;
  }

  public addTW(): void {
    if (this.feed.exerciseId) {
      ExerciseManagement.addToWorkout({
        _id: this.feed.exerciseId || '',
        title: this.feed.title || '',
        thumbnail: this.feed.thumbnail || '',
        type: 'gym',
        difficulty: 0,
        affectedMuscles: []
      });
    }
  }

  public editPost(): void {
    this.$router.push({ name: 'edit-post', params: { id: this.feed._id } });
  }

  public deletePost(): void {
    backend.delete('feed/' + this.feed._id);
    FeedManagement.removePost(this.feed._id);
  }
}
</script>

<style lang="scss" scoped>
.fh-feed-card {
  .tc-action {
    z-index: 100;
    /deep/ .actions-wrapper {
      bottom: unset;
      top: 0px;
      z-index: 110;
    }
  }

  border-radius: $border-radius;
  margin-bottom: 20px;
  position: relative;

  box-shadow: $shadow-light;

  border: 1.5px solid $paragraph;
  background: $paragraph;
  @media #{$isDark} {
    background: $paragraph_dark;
    border-color: $paragraph_dark;
  }
  overflow: hidden;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    filter: blur(20px) saturate(180%);

    background: linear-gradient(rgba($color_dark, 0.8), rgba($color_dark, 0.8)),
      var(--background-url);
    @media #{$isDark} {
      background: linear-gradient(rgba($color, 0.75), rgba($color, 0.75)),
        var(--background-url);
    }
    background-size: cover;
    background-position: center;
    border-radius: inherit;
  }

  .content-wrapper {
    position: relative;
    z-index: 1;
    border-radius: inherit;

    .fh-feed-item--head {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-gap: 10px;
      padding: 10px;
      .tc-avatar {
        width: 40px;
        height: 40px;
      }
      .info {
        display: grid;
        place-content: center start;
        .name {
          font-weight: bold;
        }
        .time {
          opacity: 0.5;
          font-size: 13px;
        }
      }
    }

    .fh-feed-item--footer {
      margin: 10px;
      padding: 10px 5px;

      border-radius: inherit;
      text-align: center;
      white-space: nowrap;
      overflow-y: auto;

      background: rgba($color_dark, 0.5);
      @include custom-scrollbar__light();
      @media #{$isDark} {
        background: rgba($color, 0.5);
        @include custom-scrollbar__dark();
      }
    }

    .fh-feed-item--content {
      margin: 10px 20px;
      img {
        border-radius: $border-radius;
        width: 100%;
        max-height: 200px;
        object-fit: cover;
      }
      h2 {
        margin: 0 0 10px;
      }
      p {
        margin-top: 0;
      }
    }
  }
}
</style>
