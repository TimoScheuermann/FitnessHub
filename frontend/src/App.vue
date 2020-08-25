<template lang="html">
  <div>
    <div id="mobile">
      <tc-header title="Fitness Planner" />
      <tc-tabbar>
        <tc-tabbar-item routeName="home" icon="house" title="Home" />
        <tc-tabbar-item routeName="community" icon="users" title="Community" />
        <tc-tabbar-item routeName="login" icon="login" title="Anmelden" />
      </tc-tabbar>
    </div>
    <div id="desktop">
      <tc-navbar>
        <b slot="logo"><i class="ti-gym" /> Fitness Planner</b>
        <tc-navbar-item routeName="home" icon="house" name="Home" />
        <tc-navbar-item routeName="community" icon="users" name="Community" />
        <template slot="actions">
          <tc-button name="Anmelden" icon="login" routeName="login" />
        </template>
      </tc-navbar>
    </div>

    <router-view />
  </div>
</template>

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
  padding: 50px 5vw {
    top: calc(50px + env(safe-area-inset-top));
    bottom: calc(20px + env(safe-area-inset-bottom));
  }
  @media #{$isMobile} {
    padding-bottom: calc(70px + env(safe-area-inset-bottom));
  }
}
</style>
