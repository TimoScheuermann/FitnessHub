<template>
  <div class="fh-feed-item-wrapper">
    <div class="fh-feed-item--head">
      <tc-avatar
        size="tiny"
        src="https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100"
      />
      <div class="info">
        <div class="name">Timo Scheuermann</div>
        <div class="time">am 3. März um 15:44 Uhr</div>
      </div>
    </div>

    <slot />

    <div class="fh-feed-item--footer">
      <div class="rection">
        🔥
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHFeedItemWrapper extends Vue {}
</script>

<style lang="scss" scoped>
.fh-feed-item-wrapper {
  padding: 20px;
  background: $paragraph_dark;
  border-radius: 20px;
  box-shadow: $shadow-light;
  margin-bottom: 20px;

  .fh-feed-item--head {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 10px;
    margin-bottom: 20px;
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
    background: $color;
    padding: 10px;
    margin: 10px -10px -10px;
    border-radius: 15px;
  }
}
</style>
