<template>
  <div class="management-interim">
    <fp-mobile-header :title="title || 'Profile'">
      <tc-header-button
        v-if="$route.name !== 'profile'"
        routeName="profile"
        name="Profil"
      />
    </fp-mobile-header>

    <tc-hero :hasFixedHeader="fixedHeader" :height="200">
      <img
        src="https://images.unsplash.com/photo-1597075933405-a06cb4d6cecb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
        slot="background"
        alt=""
      />
      <h1 v-if="$route.name !== 'profile'">{{ title }}</h1>

      <tl-flow v-else>
        <fp-avatar />
        <div class="info">
          <div class="name">{{ name }}</div>
          <div class="date">Mitglied seit: {{ date }}</div>
        </div>
      </tl-flow>
    </tc-hero>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FPAvatar from '@/components/shared/FP-Avatar.vue';
import FPMobileHeader from '@/components/shared/FP-Mobile-Header.vue';

@Component({
  components: {
    'fp-avatar': FPAvatar,
    'fp-mobile-header': FPMobileHeader
  }
})
export default class ProfileInterim extends Vue {
  public mq = window.matchMedia('(min-width: 851px)');
  public fixedHeader = this.mq.matches;

  mounted() {
    this.mq.addListener(this.mediaListener);
  }

  beforeDestroy() {
    this.mq.removeListener(this.mediaListener);
  }

  public mediaListener(event: MediaQueryListEvent): void {
    this.fixedHeader = event && event.matches;
  }

  get title(): string {
    return this.$route.path
      .split('/')[2]
      .split('-')
      .join(' ');
  }

  get name(): string {
    const user = this.$store.getters.user;
    return [user.givenName, user.familyName].filter(x => !!x).join(' ');
  }

  get date(): string {
    const date: Date = new Date(this.$store.getters.user.date);
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
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
  .tl-flow {
    margin-top: env(safe-area-inset-top);
    .fp-avatar,
    .tc-avatar {
      transform: scale(0.8);
      margin: 5px;
    }
    .info {
      margin: 5px;
      color: #fff;
      .name {
        font-weight: 500;
        font-size: 1.2em;
      }
    }
  }
}
</style>
