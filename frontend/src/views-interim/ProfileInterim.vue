<template>
  <div class="profile-interim">
    <fh-mobile-header :title="title">
      <router-link
        v-if="$route.name === 'chatroom'"
        class="chat-partner"
        slot="right"
        :to="{ name: 'friend', params: { id: friend._id } }"
      >
        <div class="name">{{ friend.username }}</div>
        <fh-avatar :user="friend" />
      </router-link>

      <tc-header-button
        v-if="$route.name === 'chatroom'"
        name="Nachrichten"
        routeName="messages"
      />
      <tc-header-button
        v-else-if="$route.name === 'friend'"
        name="Freunde"
        routeName="friends"
      />
      <tc-header-button
        v-else-if="$route.name !== 'profile'"
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
        <template v-if="!['profile', 'friend'].includes($route.name)">
          <h1 v-if="$route.name !== 'chatroom'">{{ title }}</h1>
          <tl-flow v-else>
            <fh-avatar :user="friend" />
            <div class="info">
              <div class="name">{{ friend.username }}</div>
              <tl-flow>
                <tc-button
                  name="Profil ansehen"
                  variant="filled"
                  background="#fff"
                  color="#000"
                  :to="{ name: 'friend', params: { id: friend._id } }"
                />
              </tl-flow>
            </div>
          </tl-flow>
        </template>

        <tl-flow v-else-if="$route.name === 'friend'">
          <fh-avatar :user="friend" />
          <div class="info" v-if="$store.getters.valid">
            <div class="name">{{ friend.username }}</div>
            <div class="date">Mitglied seit: TODO:</div>
          </div>
        </tl-flow>

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
import { Vue, Component, Watch } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';

@Component
export default class ProfileInterim extends Vue {
  @Watch('$route.name')
  public routeNameChanged(to: string): void {
    if (to === 'friend') {
      // TODO: load user info
    }
  }

  get title(): string | undefined {
    if (this.$route.name === 'friend') return this.friend.username;
    if (this.$route.name === 'chatroom') return undefined;
    return this.$route.meta.title;
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
      .tc-button {
        margin-top: 10px;
      }
    }
  }
}
.chat-partner {
  display: flex;
  align-items: center;
  color: inherit;
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
