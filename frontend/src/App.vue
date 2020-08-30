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
      </tc-tabbar>
    </div>
    <div id="desktop">
      <fh-navbar />
    </div>

    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ITotalMessages } from './utils/interfaces';
import axios from './utils/axios';
import FHNavbar from './components/global/FH-Navbar.vue';

@Component({
  components: {
    'fh-navbar': FHNavbar
  }
})
export default class App extends Vue {
  public mq = window.matchMedia('(min-width: 851px)');

  get notifications(): number {
    return this.$store.getters.totalNotifications;
  }

  async mounted() {
    const notificaitons: ITotalMessages = (await axios.get('inbox/total')).data;
    this.$store.commit('setNotifications', notificaitons);
    this.mq.addListener(this.mediaListener);
    this.$store.commit('fixedHeader', this.mq.matches);
  }

  beforeDestroy() {
    this.mq.removeListener(this.mediaListener);
  }

  public mediaListener(event: MediaQueryListEvent): void {
    this.$store.commit('fixedHeader', event && event.matches);
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
</style>
