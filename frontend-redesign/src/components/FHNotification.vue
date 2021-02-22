<template>
  <div class="fh-notification">
    <transition name="notification-slide" mode="out-in">
      <div
        class="container"
        v-if="notification"
        :cursor="notification.route"
        :key="notification.timestamp"
        @click="handleClick"
      >
        <tl-flow v-if="notification.img">
          <tc-avatar :src="notification.img" />
        </tl-flow>
        <tl-flow class="info" flow="column" vertical="start">
          <div class="title">{{ notification.title }}</div>
          <div class="text">{{ notification.text }}</div>
        </tl-flow>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { aSecond } from '@/utils/constants';
import { FHEventBus } from '@/utils/FHEventbus';
import { openFullscreen } from '@/utils/functions';
import { IFHNotification } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

type Notification = IFHNotification & { timestamp: number };

@Component
export default class FHNotification extends Vue {
  public notifications: Notification[] = [];
  public timeout: number | undefined = undefined;
  public notification: Notification | null = null;

  mounted() {
    FHEventBus.$on('fh-notification', this.addNotification);
  }

  beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public handleClick(): void {
    if (this.notification) {
      const { route } = this.notification;
      if (route) {
        const { fullscreen } = router.resolve(route).route.meta;
        if (fullscreen && route.name) {
          openFullscreen(route.name, route.params, route.query);
        } else {
          router.push(route);
        }
      }
    }
  }

  public addNotification(notification: IFHNotification) {
    this.notifications.push({
      ...notification,
      timestamp: new Date().getTime()
    });
    this.nextNotificiation();
  }

  public nextNotificiation() {
    if (this.timeout) return;

    this.notification = this.notifications.shift() || null;

    if (!this.notification) return;

    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      this.nextNotificiation();
    }, aSecond * 5);
  }
}
</script>

<style lang="scss" scoped>
.fh-notification {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;

  .container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0;
    padding: 10px;
    width: calc(90vw - 20px);
    max-width: 500px;
    margin-top: calc(20px + env(safe-area-inset-top));

    border-radius: 50px;
    user-select: none;

    @include backdrop-blur($color_dark);
    @media #{$isDark} {
      @include backdrop-blur($color);
    }

    .tc-avatar {
      height: 40px;
      width: 40px;
    }
    .info {
      margin: 0 15px;
      .title {
        font-weight: 700;
        opacity: 0.75;
        text-transform: uppercase;
        font-size: 13px;
        margin-bottom: 2px;
      }
      .text {
        font-weight: 500;
      }
    }
  }
}

.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.5s ease-in-out;
}
.notification-slide-enter,
.notification-slide-leave-to {
  transform: translateY(-80px) scale(0.8);
  opacity: 0;
}
</style>
