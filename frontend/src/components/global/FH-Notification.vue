<template>
  <div class="fh-notification">
    <transition mode="out-in" name="notification">
      <div
        v-if="notification"
        class="notification-container"
        :class="{ clickable: notification.to, dark: $store.getters.darkmode }"
        :key="notification.text"
        @click="goto"
      >
        <tl-flow>
          <img v-if="notification.img" :src="notification.img" alt="" />
        </tl-flow>
        <div>
          <div class="title">{{ notification.title }}</div>
          <div class="text">{{ notification.text }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { IFHNotification } from '@/utils/interfaces';
import { EventBus } from '@/utils/eventbus';

@Component
export default class FHNotification extends Vue {
  public notification: IFHNotification | null = null;

  public timer: number | undefined = undefined;

  public goto() {
    if (this.notification && this.notification.to) {
      this.$router.push(this.notification.to);
      this.reset();
      this.nextNotification();
    }
  }

  public nextNotification() {
    this.notification = this.$store.state.notifications.shift();
    if (!this.notification && this.timer) {
      this.reset();
      return;
    }

    this.timer = setTimeout(() => {
      this.nextNotification();
    }, 7000);
  }

  public reset(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  mounted() {
    EventBus.$on('message', () => {
      if (!this.timer) this.nextNotification();
    });
  }

  beforeDestroy() {
    if (this.timer) {
      this.reset();
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-notification {
  .notification-container {
    z-index: 20000;
    &.clickable {
      cursor: pointer;
    }

    position: fixed;
    left: 5vw;
    @media only screen and(max-width: 500px) {
      right: 5vw;
      top: calc(5vw + env(safe-area-inset-top));
    }
    max-width: 500px;

    @media #{$isDesktop} {
      top: calc(70px + env(safe-area-inset-top));
    }
    padding: 10px;
    border-radius: $border-radius;

    @include backdrop-blur($paragraph);
    &.dark {
      @include backdrop-blur($paragraph_dark);
    }

    display: grid;
    grid-template-columns: auto 1fr;

    img {
      width: 40px;
      height: 40px;
      border-radius: 40px;
      margin-right: 10px;
    }
    .title {
      font-weight: 500;
    }
  }
}
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}
.notification-enter,
.notification-leave-to {
  margin-top: -30px;
  transform: scale(0.9);
  opacity: 0;
}
</style>