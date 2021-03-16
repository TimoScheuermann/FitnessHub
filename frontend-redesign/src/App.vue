<template>
  <div class="fitnesshub">
    <FHNotification />
    <FHTabbar />
    <FHNavbar />
    <FHRouter />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FHNavbar from './components/FHNavbar.vue';
import FHRouter from './components/FHRouter.vue';
import FHTabbar from './components/FHTabbar.vue';
import {
  registerMediaQueries,
  unregisterMediaQueries
} from '@/utils/mediaQueries';
import {
  IAchievment,
  IExercise,
  IFeed,
  IMessage,
  IPendingFriendship,
  IUserInfo
} from './utils/interfaces';
import { UserManagement } from './utils/UserManagement';
import { Socket } from 'vue-socket.io-extended';
import FHNotification from './components/FHNotification.vue';
import { ExerciseManagement } from './utils/ExerciseManagement';
import { VariableManagement } from './utils/VariableManagement';
import { FeedManagement } from './utils/FeedManagement';
import { AchievementManager } from './utils/AchievementManager';

@Component({
  components: {
    FHTabbar,
    FHNavbar,
    FHRouter,
    FHNotification
  }
})
export default class App extends Vue {
  mounted() {
    registerMediaQueries();
    VariableManagement.loadVariables();
  }

  beforeDestroy() {
    unregisterMediaQueries();
  }

  @Socket('achievement')
  newAchievement(achievement: IAchievment) {
    AchievementManager.add(achievement);
  }

  @Socket('message')
  messageReceived(message: IMessage) {
    UserManagement.storeMessage(message);
  }

  @Socket('removeFriendRequest')
  removeFriendRequest(requestId: string) {
    UserManagement.removeFriendInvite(requestId);
  }

  @Socket('newFriendRequest')
  newFriendRequest(request: IPendingFriendship) {
    UserManagement.addPendingFriendship(request);
  }

  @Socket('addFriend')
  addFriend(friend: IUserInfo) {
    UserManagement.addFriend(friend);
  }

  @Socket('removeFriend')
  removeFriend(id: string) {
    UserManagement.removeFriendFromList(id);
  }

  @Socket('exercise')
  addCreatedExercise(exercise: IExercise) {
    ExerciseManagement.addCreated(exercise);
  }

  @Socket('exercise.remove')
  removeCreatedExercise(exercise: IExercise) {
    ExerciseManagement.removeCreated(exercise._id);
  }

  @Socket('exerciseSubmission')
  addExerciseSubmission(exercise: IExercise) {
    ExerciseManagement.addSubmission(exercise);
  }

  @Socket('exerciseSubmission.remove')
  removeExerciseSubmission(exercise: IExercise) {
    ExerciseManagement.removeSubmission(exercise._id);
  }

  @Socket('feed-created')
  feedCreated(feed: IFeed) {
    FeedManagement.addPosts([feed]);
  }

  @Socket('feed-updated')
  feedUpdated(feed: IFeed) {
    FeedManagement.addPosts([feed]);
  }

  @Socket('telegram')
  telegramChat(chat: number) {
    this.$store.commit('telegramChat', chat);
  }
}
</script>

<style lang="scss">
html {
  font-family: -apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI,
    Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
    Segoe UI Symbol;
  scroll-behavior: smooth;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;

  @include custom-scrollbar__light();
  background: $background;
  color: $color;

  @media #{$isDark} {
    @include custom-scrollbar__dark();
    background: $background_dark;
    color: $color_dark;
  }

  overflow-x: hidden;
}

body {
  margin: 0;
}

[class^='interim'] {
  min-height: 100vh;
}

[center] {
  text-align: center;
}

[error] {
  color: $error;
}

[alarm] {
  color: $alarm;
}

[success] {
  color: $success;
}

[huge] {
  font-size: 40px;
}

[content] {
  padding-top: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  padding-left: calc(5vw + env(safe-area-inset-left));
  padding-right: calc(5vw + env(safe-area-inset-right));
  @media #{$isMobile} {
    padding-bottom: calc(70px + env(safe-area-inset-bottom));
  }
}

[max-width] {
  max-width: 800px;
  margin: 0 auto;
}

[line-break] {
  white-space: pre-line;
}

[cursor] {
  cursor: pointer;
}

[transition] {
  transition: all 0.2s ease-in-out;
}

.fh-graph-card {
  background: $paragraph;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
  padding: 10px;
  border-radius: #{1.5 * $border-radius};
}
</style>
