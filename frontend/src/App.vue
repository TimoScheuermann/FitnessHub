<template>
  <div>
    <div id="mobile">
      <tc-tabbar>
        <tc-tabbar-item routeName="home" icon="house" title="Home" />
        <tc-tabbar-item routeName="community" icon="users" title="Feed" />
        <tc-badge v-if="$store.getters.valid" :value="notifications">
          <tc-tabbar-item routeName="profile" icon="user" title="Profil" />
        </tc-badge>
        <tc-tabbar-item v-else routeName="login" icon="user" title="Profil" />
        <tc-tabbar-item
          routeName="nutrition"
          icon="food-bowl"
          title="Ernährung"
        />
        <tc-tabbar-item routeName="search" icon="lens" title="Suche" />
      </tc-tabbar>
    </div>
    <div id="desktop">
      <tc-navbar>
        <b slot="logo"><i class="ti-gym" /> Fitness Planner</b>
        <tc-navbar-item routeName="home" icon="house" name="Home" />
        <tc-navbar-item routeName="community" icon="users" name="Feed" />
        <tc-navbar-item
          routeName="nutrition"
          icon="food-bowl"
          name="Ernährung"
        />
        <tc-navbar-item routeName="search" icon="lens" name="Suche" />
        <template slot="actions">
          <tc-badge v-if="$store.getters.valid" :value="notifications">
            <tc-button name="Profil" routeName="profile" />
          </tc-badge>
          <tc-button v-else name="Profil" icon="user" routeName="login" />
        </template>
      </tc-navbar>
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

@Component
export default class App extends Vue {
  get notifications(): number {
    return this.$store.getters.totalNotifications;
  }

  async mounted() {
    const notificaitons: ITotalMessages = (await axios.get('inbox/total')).data;
    this.$store.commit('setNotifications', notificaitons);
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
