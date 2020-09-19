<template>
  <div class="profile-interim">
    <fh-mobile-header :title="$route.meta.title" />
    <tc-hero :dark="true" :hasFixedHeader="false" :height="200">
      <img
        src="https://images.unsplash.com/photo-1597075933405-a06cb4d6cecb?q=25"
        slot="background"
        alt=""
      />
      <transition name="hero-anim" mode="out-in">
        <div :key="$route.name">
          <h1>{{ $route.meta.title }}</h1>
          <h4>Last updated August 03, 2020</h4>
        </div>
      </transition>
    </tc-hero>
    <div class="view">
      <transition :name="$store.getters.routeTransition">
        <router-view class="child-view" />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ProfileInterim extends Vue {}
</script>
<style lang="scss" scoped>
.tc-hero {
  img {
    filter: brightness(60%);
  }
  text-align: center;
  h1 {
    margin: 0px;
    margin-top: env(safe-area-inset-top);
  }
  h4 {
    margin: 0;
  }
}

.hero-anim-enter-active,
.hero-anim-leave-active {
  transition: all 0.16s cubic-bezier(0.55, 0, 0.1, 1);
}
.hero-anim-enter,
.hero-anim-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
