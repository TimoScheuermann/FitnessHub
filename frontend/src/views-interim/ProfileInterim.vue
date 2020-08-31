<template>
  <div class="management-interim">
    <fh-mobile-header :title="title || 'Profile'">
      <template v-if="$route.name !== 'profile'">
        <tc-header-button
          v-if="$route.name !== 'chatroom'"
          routeName="profile"
          name="Profil"
        />
        <tc-header-button v-else routeName="messages" name="Nachrichten" />
      </template>
    </fh-mobile-header>

    <tc-hero
      :dark="true"
      :hasFixedHeader="$store.getters.fixedHeader"
      :height="200"
    >
      <img
        src="https://images.unsplash.com/photo-1597075933405-a06cb4d6cecb?q=25"
        slot="background"
        alt=""
      />
      <template v-if="$route.name !== 'profile'">
        <h1 v-if="$route.name !== 'chatroom'">{{ title }}</h1>
        <tl-flow v-else>
          <fh-avatar :user="friend" />
          <div class="info">
            <div class="name">{{ friend.username }}</div>
          </div>
        </tl-flow>
      </template>

      <tl-flow v-else>
        <fh-avatar />
        <div class="info">
          <div class="name">{{ name }}</div>
          <div class="date">Mitglied seit: {{ date }}</div>
        </div>
      </tl-flow>
    </tc-hero>
    <transition :name="$store.getters.routeTransition">
      <router-view class="route-view route-sub-view" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FHAvatar from '@/components/shared/FH-Avatar.vue';
import FHMobileHeader from '@/components/shared/FH-Mobile-Header.vue';
import { IUserInfo } from '@/utils/interfaces';

@Component({
  components: {
    'fh-avatar': FHAvatar,
    'fh-mobile-header': FHMobileHeader
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
    return (
      this.$route.meta.title ||
      this.$route.path
        .split('/')[2]
        .split('-')
        .join(' ')
    );
  }

  get friend(): IUserInfo {
    return this.$store.getters.friends.filter(
      (x: IUserInfo) => x._id === this.$route.params.id
    )[0];
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
    text-transform: capitalize;
  }
  .tl-flow {
    margin-top: env(safe-area-inset-top);

    .tc-avatar {
      transform: scale(0.8);
      margin: 5px;
    }
    .info {
      margin: 5px;
      .name {
        font-weight: 500;
        font-size: 1.2em;
      }
    }
  }
}
.route-sub-view {
  width: 90vw;
}
</style>
