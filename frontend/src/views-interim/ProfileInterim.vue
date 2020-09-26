<template>
  <div class="profile-interim">
    <fh-mobile-header :title="title">
      <router-link
        v-if="$route.name === 'chatroom' && friend"
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
        v-else-if="['submitExercise', 'editExercise'].includes($route.name)"
        name="Übungen"
        routeName="exercises"
      />
      <tc-header-button
        v-else-if="$route.name === 'workout-edit'"
        name="Workouts"
        routeName="workouts"
      />
      <tc-header-button
        v-else-if="['submitRecipe', 'editRecipe'].includes($route.name)"
        name="Rezepte"
        routeName="recipes"
      />
      <tc-header-button
        v-else-if="$route.name !== 'profile'"
        routeName="profile"
        name="Profil"
      />
    </fh-mobile-header>

    <tc-hero :dark="true" :hasFixedHeader="false" :height="200">
      <img src="assets/hero/profile-hero.webp" slot="background" alt="" />
      <transition name="hero-anim" mode="out-in">
        <template v-if="!['profile', 'friend'].includes($route.name)">
          <h1 v-if="$route.name !== 'chatroom'">{{ title }}</h1>
          <tl-flow v-else-if="friend">
            <fh-avatar :user="friend" />
            <tl-flow flow="column" class="info">
              <div class="name">{{ friend.username }}</div>
              <tc-button
                name="Profil ansehen"
                variant="filled"
                background="#fff"
                color="#000"
                :to="{ name: 'friend', params: { id: friend._id } }"
              />
            </tl-flow>
          </tl-flow>
          <tl-flow v-else>
            <tc-avatar src="pwa/splash/apple-icon-180.jpg" />
            <div class="name">Fitness Hub</div>
          </tl-flow>
        </template>

        <tl-flow v-else-if="$route.name === 'friend' && friend">
          <fh-avatar :user="friend" />
          <div class="info" v-if="$store.getters.valid">
            <div class="name">{{ friend.username }}</div>
            <div class="date" v-if="friendInfo">
              Mitglied seit: {{ transformDate(friendInfo.memberSince) }}
            </div>
          </div>
        </tl-flow>

        <tl-flow v-else>
          <fh-avatar />
          <div class="info" v-if="$store.getters.valid">
            <div class="name">{{ name }}</div>
            <div class="date">Mitglied seit: {{ transformDate() }}</div>
          </div>
        </tl-flow>
      </transition>
    </tc-hero>
    <div class="view">
      <transition :name="$store.getters.routeTransition">
        <router-view class="child-view" :friendInfo="friendInfo" />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { IUserInfo } from '@/utils/interfaces';
import axios from '@/utils/axios';
import { getFriend } from '@/utils/functions';
import { fhBotId } from '@/utils/constants';

@Component
export default class ProfileInterim extends Vue {
  public friendInfo: object | null = null;
  public fhBotId: string = fhBotId;

  @Watch('$route.name')
  public routeNameChanged(to: string): void {
    if (to === 'friend') {
      this.friendInfo = null;
      axios
        .get('friends/info/' + this.$route.params.id)
        .then(res => (this.friendInfo = res.data));
    }
  }

  get title(): string | undefined {
    if (this.$route.name === 'friend') {
      if (this.friend) return this.friend.username;
      return 'TODO:';
    }
    if (this.$route.name === 'chatroom') return undefined;
    return this.$route.meta.title;
  }

  get friend(): IUserInfo | undefined {
    return getFriend(this.$route.params.id);
  }

  get name(): string {
    const user = this.$store.getters.user;
    return [user.givenName, user.familyName].filter(x => !!x).join(' ');
  }

  transformDate(timestamp = this.$store.getters.user.date): string {
    const date = new Date(timestamp);
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
