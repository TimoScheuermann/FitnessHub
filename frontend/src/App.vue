<template>
  <div>
    <div id="mobile">
      <tc-tabbar>
        <tc-tabbar-item
          tfcolor="success"
          routeName="home"
          icon="house"
          title="Home"
        />
        <tc-tabbar-item
          tfcolor="success"
          routeName="community"
          icon="users"
          title="Feed"
        />
        <tc-badge v-if="$store.getters.valid" :value="notifications">
          <tc-tabbar-item
            tfcolor="success"
            routeName="profile"
            icon="user"
            title="Profil"
          />
        </tc-badge>
        <tc-tabbar-item
          tfcolor="success"
          v-else
          routeName="login"
          icon="user"
          title="Profil"
        />
        <tc-tabbar-item
          tfcolor="success"
          routeName="training"
          icon="gym"
          title="Training"
        />
        <tc-tabbar-item
          tfcolor="success"
          routeName="nutrition"
          icon="food-bowl"
          title="Ernährung"
        />
      </tc-tabbar>
    </div>
    <div id="desktop">
      <fh-navbar />
    </div>

    <div class="view">
      <router-view />
    </div>

    <fh-notification />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FHNavbar from './components/global/FH-Navbar.vue';
import { Socket } from 'vue-socket.io-extended';
import { IMessage, IPendingFriendship, IUserInfo } from './utils/interfaces';
import FHNotification from './components/global/FH-Notification.vue';
import {
  sendNotification,
  getFriendName,
  getFriendAvatar
} from './utils/functions';

@Component({
  components: {
    'fh-navbar': FHNavbar,
    'fh-notification': FHNotification
  }
})
export default class App extends Vue {
  public mq = window.matchMedia('(min-width: 851px)');

  get notifications(): number {
    return this.$store.getters.totalNotifications;
  }

  async mounted() {
    this.mq.addListener(this.mediaListener);
    this.$store.commit('fixedHeader', this.mq.matches);
  }

  beforeDestroy() {
    this.mq.removeListener(this.mediaListener);
  }

  public mediaListener(event: MediaQueryListEvent): void {
    this.$store.commit('fixedHeader', event && event.matches);
  }

  @Socket('message')
  messageReceived(message: IMessage) {
    this.$store.commit('addMessage', message);
    if (
      message.from !== this.$store.getters.user._id &&
      !(
        this.$route.name === 'chatroom' &&
        this.$route.params.id === message.from
      )
    ) {
      if (message.type === 'message') {
        sendNotification({
          title: getFriendName(message.from) + ' sagt:',
          text: message.content,
          to: { name: 'chatroom', params: { id: message.from } },
          img: getFriendAvatar(message.from)
        });
      }
    }
  }

  @Socket('newFriendRequest')
  newFriendRequest(request: IPendingFriendship) {
    this.$store.commit('addFriendRequest', request);
    if (request.invitee._id !== this.$store.getters.user._id) {
      sendNotification({
        title: 'Freundschaftsanfrage',
        text: request.invitee.username + ' möchte dein Freund werden.',
        to: { name: 'friends' },
        img: request.invitee.avatar
      });
    }
  }

  @Socket('removeFriendRequest')
  removeFriendRequest(id: string) {
    this.$store.commit('removeFriendRequest', id);
  }

  @Socket('addFriend')
  addFriend(friend: IUserInfo) {
    this.$store.commit('addFriend', friend);
    if (friend._id !== this.$store.getters.user._id) {
      sendNotification({
        title: 'Freundschaft',
        text: 'mit ' + friend.username + ' geschlossen',
        to: { name: 'friends' },
        img: friend.avatar
      });
    }
  }

  @Socket('removeFriend')
  removeFriend(id: string) {
    this.$store.commit('removeFriend', id);
  }
}
</script>

<style lang="scss">
html {
  font-family: -apple-system, BlinkMacSystemFont, SF Pro Display, Inter,
    Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol;
  scroll-behavior: smooth;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;

  background: $background;
  color: $color;
}

body {
  margin: 0;
  min-height: 100vh;
}

a {
  text-decoration: none;
}

#mobile {
  @media #{$isDesktop} {
    display: none;
  }
}
#desktop {
  @media #{$isMobile} {
    display: none;
  }
}

[content] {
  padding: calc(20px + env(safe-area-inset-bottom)) 5vw {
    top: 0px;
  }
  @media #{$isMobile} {
    padding-bottom: calc(70px + env(safe-area-inset-bottom));
  }
}
.tc-tabbar {
  .tc-badge {
    flex: 1 1 0px;
    margin: 0 2.5px;
  }
}

.view {
  position: relative;
  max-width: 100vw;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  .route-view {
    position: absolute;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(60px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-60px, 0);
}
</style>
