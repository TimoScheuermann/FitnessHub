<template>
  <div class="fh-feed-item-wrapper" v-if="user && timestamp">
    <div
      class="background"
      v-if="bgImage"
      :style="`--background-url: url(${bgImage})`"
    />
    <div class="content-wrapper">
      <div class="fh-feed-item--head">
        <tc-avatar :src="user.avatar" />
        <div class="info">
          <div class="name">{{ user.username }}</div>
          <div class="time">{{ time }}</div>
        </div>
      </div>

      <slot />

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
        <div class="spacer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { months } from '@/utils/constants';
import { IUserInfo } from '@/utils/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHFeedItemWrapper extends Vue {
  @Prop() bgImage!: string;
  @Prop() user!: IUserInfo;
  @Prop() timestamp!: number;

  get time(): string {
    const date = new Date(this.timestamp);
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
}
</script>

<style lang="scss" scoped>
.fh-feed-item-wrapper {
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
  }

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
    padding: 10px;

    border-radius: inherit;

    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow-y: auto;

    background: rgba($color_dark, 0.5);
    @include custom-scrollbar__light();
    @media #{$isDark} {
      background: rgba($color, 0.5);
      @include custom-scrollbar__dark();
    }

    .spacer {
      width: 10px;
      height: 20px;
      flex-shrink: 0;
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

      padding: 5px;
      border-radius: inherit;
      margin: 0 5px;
      &:first-child {
        margin-left: 0;
      }
      &:nth-last-child(2) {
        margin-right: 0;
      }

      display: flex;
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
}
</style>
