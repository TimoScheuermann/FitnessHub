<template>
  <div class="profile-interim">
    <fh-mobile-header v-if="$route.name === 'chatroom'">
      <tc-header-button routeName="messages" name="Nachrichten" />
      <tl-flow class="chat-partner" slot="right">
        <div class="name">{{ friend.username }}</div>
        <fh-avatar :user="friend" />
      </tl-flow>
    </fh-mobile-header>

    <fh-mobile-header v-else :title="title || 'Profile'">
      <tc-header-button
        v-if="$route.name !== 'profile'"
        routeName="profile"
        name="Profil"
      />
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
      <transition name="hero-anim" mode="out-in">
        <template v-if="$route.name !== 'profile'">
          <h1 v-if="$route.name !== 'chatroom'">{{ title }}</h1>
          <tl-flow v-else flow="column">
            <fh-avatar size="small" :user="friend" />
            <div class="info">
              <div class="name">{{ friend.username }}</div>
            </div>
          </tl-flow>
        </template>

        <tl-flow v-else>
          <fh-avatar />
          <div class="info" v-if="$store.getters.valid">
            <div class="name">{{ name }}</div>
            <div class="date">Mitglied seit: {{ date }}</div>
          </div>
        </tl-flow>
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
import { IUserInfo } from '@/utils/interfaces';

@Component
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
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
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
.chat-partner {
  .tc-avatar {
    margin-left: 10px;
    height: 30px;
    width: 30px;
  }
  .name {
    max-width: calc(90vw - 150px);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
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
