<template>
  <div class="management-interim">
    <tc-header-button
      slot="button"
      color="#fff"
      routeName="profile"
      name="Profil"
    />
    <tc-hero :hasFixedHeader="false" :height="200">
      <img
        src="https://images.unsplash.com/photo-1597075933405-a06cb4d6cecb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
        slot="background"
        alt=""
      />
      <h1>{{ title }}</h1>
    </tc-hero>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class ManagementInterim extends Vue {
  get title(): string {
    return this.$route.path
      .split('/')[2]
      .split('-')
      .join(' ');
  }
}
</script>
<style lang="scss" scoped>
.tc-hero {
  img {
    filter: brightness(60%);
  }
  h1 {
    margin: 0px;
    margin-top: env(safe-area-inset-top);
    color: #fff;
    text-transform: capitalize;
  }
}
.tc-header-button {
  position: absolute;
  z-index: 10;
  left: 5vw;
  top: calc(20px + env(safe-area-inset-top));
}
</style>
