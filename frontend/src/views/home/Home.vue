<template>
  <div class="home">
    <fh-mobile-header :title="$store.getters.valid ? 'Home' : 'FitnessHub'" />
    <tc-hero :dark="true" :hasFixedHeader="false" :height="200">
      <img src="assets/hero/fh-hero.webp" slot="background" alt />

      <div class="info" v-if="$store.getters.valid">
        <div class="welcomeMessage">{{ returnWelcomeMessage }},</div>
        <div class="name">
          {{ $store.getters.user.givenName }}
          {{ $store.getters.user.familyName }}
        </div>
      </div>
      <template v-else>
        <h1><i class="ti-gym" /> FitnessHub</h1>
      </template>
    </tc-hero>
    <fh-about v-if="!$store.getters.valid" />
    <fh-landing v-else />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import About from './About.vue';
import Landing from './Landing.vue';

@Component({
  components: {
    'fh-landing': Landing,
    'fh-about': About
  }
})
export default class Home extends Vue {
  get returnWelcomeMessage(): string {
    const hours = new Date().getHours();

    if ((hours >= 22 && hours <= 24) || (hours >= 0 && hours < 5)) {
      return 'Gute Nacht';
    } else if (hours >= 5 && hours < 11) {
      return 'Guten Morgen';
    } else if (hours >= 11 && hours < 17) {
      return 'Guten Tag';
    } else if (hours >= 17 && hours < 22) {
      return 'Guten Abend';
    } else {
      return '';
    }
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
    text-transform: capitalize;
  }
  .info {
    margin: 5px;
    margin-top: env(safe-area-inset-top);
    .welcomeMessage {
      font-weight: 500;
      font-size: 1.4em;
    }
    .name {
      font-size: 1.6em;
      font-weight: bold;
    }
  }
}
</style>
