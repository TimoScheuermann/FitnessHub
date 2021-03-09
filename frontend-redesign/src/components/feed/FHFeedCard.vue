<template>
  <div class="fh-feed-card" v-if="feed">
    <div
      class="background"
      v-if="feed.thumbnail"
      :style="`--background-url: url(${feed.thumbnail})`"
    />
    <div class="content-wrapper">
      <div class="fh-feed-item--head">
        <tc-avatar :src="user.avatar" />
        <div class="info">
          <div class="name">{{ user.username }}</div>
          <div class="time">{{ time }}</div>
        </div>
      </div>

      <div class="fh-feed-item--content">
        <tl-grid gap="20">
          <div v-if="feed.thumbnail">
            <img :src="feed.thumbnail" />
          </div>
          <div>
            <h2 v-if="feed.title">{{ feed.title }}</h2>
            <p>{{ feed.text }}</p>

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
        <div class="reaction">
          <div class="emote">🔥</div>
          <div class="amount">20</div>
        </div>
        <div class="reaction">
          <div class="emote">❤️</div>
          <div class="amount">25</div>
        </div>
        <div class="reaction">
          <div class="emote">💪</div>
          <div class="amount">33</div>
        </div>
        <div class="reaction">
          <div class="emote">👍</div>
          <div class="amount">100</div>
        </div>
        <div class="reaction">
          <div class="emote">🙉</div>
          <div class="amount">8</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { fhBotId, months } from '@/utils/constants';
import { ExerciseManagement } from '@/utils/ExerciseManagement';
import { IFeed, IUserInfo } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHFeedCard extends Vue {
  @Prop() feed!: IFeed;

  get user(): IUserInfo {
    return (
      this.feed.user || {
        _id: fhBotId,
        username: 'FitnessHub',
        avatar: 'pwa/splash/manifest-icon-192.jpg'
      }
    );
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
}
</script>

<style lang="scss" scoped>
.fh-feed-card {
  border-radius: $border-radius;
  // margin-bottom: 20px;
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
      grid-template-columns: auto 1fr;
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

      .reaction {
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
