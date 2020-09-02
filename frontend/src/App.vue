<template>
  <div>
    <tc-tabbar
      id="mobile"
      :dark="$store.getters.darkmode"
      :key="$store.getters.darkmode"
    >
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
    <fh-navbar id="desktop" />

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
  public mqFixedHeader = window.matchMedia('(min-width: 851px)');
  public mqDarkmode = window.matchMedia('(prefers-color-scheme: dark)');

  get notifications(): number {
    return this.$store.getters.totalNotifications;
  }

  async mounted() {
    this.mqFixedHeader.addListener(this.mediaListenerHeader);
    this.mqDarkmode.addListener(this.mediaListenerDarkmode);
    this.$store.commit('fixedHeader', this.mqFixedHeader.matches);
    this.$store.commit('darkmode', this.mqDarkmode.matches);
    document.documentElement.classList[
      this.mqDarkmode.matches ? 'add' : 'remove'
    ]('dark');
  }

  beforeDestroy() {
    this.mqFixedHeader.removeListener(this.mediaListenerHeader);
    this.mqDarkmode.removeListener(this.mediaListenerDarkmode);
  }

  public mediaListenerHeader(event: MediaQueryListEvent): void {
    this.$store.commit('fixedHeader', event && event.matches);
  }
  public mediaListenerDarkmode(event: MediaQueryListEvent): void {
    const matches = event && event.matches;
    document.documentElement.classList[matches ? 'add' : 'remove']('dark');
    this.$store.commit('darkmode', matches);
    this.$forceUpdate();
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
          title: getFriendName(message.from),
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

  &.dark {
    background: $background_dark;
    color: $color_dark;
  }
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
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
}
.child-view {
  position: absolute;
  right: 0;
  left: 0;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
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
