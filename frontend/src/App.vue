<template>
  <div class="fitnesshub">
    <!-- <fh-navbar id="desktop" /> -->
    <fh-tabbar v-if="!$store.getters.isDesktop" />
    <fh-notification />
    <fh-edit-trainingplan />
    <fh-run-workout />
    <fh-modal-exercise-details />
    <fh-modal-recipe-details />
    <fh-modal-workout-details />
    <fh-modal-create-workout />
    <fh-modal-add-to-workout />
    <fh-modal-user-search />
    <fh-modal-exercise-search />

    <tl-sidebar
      sidebarBackgroundImage="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?h=1920"
      :blurred="true"
    >
      <template v-if="$store.getters.isDesktop">
        <fh-sidebar-head slot="sidebar-header" />
        <fh-sidebar-items slot="sidebar-content" />
      </template>
      <div class="app-wrapper">
        <div class="view-wrapper">
          <div class="view">
            <transition name="main-route">
              <router-view class="child-view" />
            </transition>
          </div>
        </div>
        <fh-profile-sidebar />
      </div>
    </tl-sidebar>

    <div class="loading" v-if="$store.getters.loading">
      <tc-spinner :dark="$store.getters.darkmode" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import FHNavbar from '@/components/global/FH-Navbar.vue';
import FHNotification from '@/components/global/FH-Notification.vue';
import FHTabbar from '@/components/global/FH-Tabbar.vue';
import MessageSocketManager from '@/socketManager/MessageSocket.manager';
import FriendSocketManager from '@/socketManager/FriendSocket.manager';
import ExerciseSocketManager from '@/socketManager/ExerciseSocket.manager';
import WorkoutSocketManager from '@/socketManager/WorkoutSocket.manager';
import FHEditTrainingplan from './components/workout/FH-EditTrainingplan.vue';
import FHRunWorkout from './components/workout/FH-RunWorkouts.vue';
import FHModalExerciseDetails from './components/globalModals/FH-Modal-ExerciseDetails.vue';
import FHModalRecipeDetails from './components/globalModals/FH-Modal-RecipeDetails.vue';
import FHModalWorkoutDetails from './components/globalModals/FH-Modal-WorkoutDetails.vue';
import FHModalCreateWorkout from './components/globalModals/FH-Modal-CreateWorkout.vue';
import FHModalAddToWorkout from './components/globalModals/FH-Modal-AddToWorkout.vue';
import FHModalUserSearch from './components/globalModals/FH-Modal-UserSearch.vue';
import axios from './utils/axios';
import { IVariable } from './utils/interfaces';
import FHModalExerciseSearch from './components/globalModals/FH-Modal-ExerciseSearch.vue';
import FHSidebarItems from './components/global/FH-Sidebar-Items.vue';
import FHSidebarHead from './components/global/FH-Sidebar-Head.vue';
import FHProfileSidebar from './components/global/FH-Profile-Sidebar.vue';

@Component({
  components: {
    'fh-navbar': FHNavbar,
    'fh-tabbar': FHTabbar,
    'fh-sidebar-items': FHSidebarItems,
    'fh-sidebar-head': FHSidebarHead,
    'fh-notification': FHNotification,
    'fh-edit-trainingplan': FHEditTrainingplan,
    'fh-run-workout': FHRunWorkout,
    'fh-modal-exercise-details': FHModalExerciseDetails,
    'fh-modal-recipe-details': FHModalRecipeDetails,
    'fh-modal-workout-details': FHModalWorkoutDetails,
    'fh-modal-create-workout': FHModalCreateWorkout,
    'fh-modal-add-to-workout': FHModalAddToWorkout,
    'fh-modal-user-search': FHModalUserSearch,
    'fh-modal-exercise-search': FHModalExerciseSearch,
    'fh-profile-sidebar': FHProfileSidebar
  }
})
export default class App extends Mixins(
  FriendSocketManager,
  MessageSocketManager,
  ExerciseSocketManager,
  WorkoutSocketManager
) {
  public mqIsDesktop = window.matchMedia('(min-width: 851px)');
  public mqIsFullscreen = window.matchMedia('(min-width: 1250px)');
  public mqDarkmode = window.matchMedia('(prefers-color-scheme: dark)');

  async mounted() {
    this.mqIsDesktop.addListener(this.mediaListenerHeader);
    this.mqIsFullscreen.addListener(this.mediaListenerFullscreen);
    this.mqDarkmode.addListener(this.mediaListenerDarkmode);
    this.$store.commit('isDesktop', this.mqIsDesktop.matches);
    this.$store.commit('isFullscreen', this.mqIsFullscreen.matches);
    this.$store.commit('darkmode', this.mqDarkmode.matches);
    document.documentElement.classList[
      this.mqDarkmode.matches ? 'add' : 'remove'
    ]('dark');

    axios.get('variables').then(res => {
      res.data.forEach((x: IVariable) => this.$store.commit('addVariable', x));
    });
  }

  beforeDestroy() {
    this.mqIsDesktop.removeListener(this.mediaListenerHeader);
    this.mqIsFullscreen.removeListener(this.mediaListenerFullscreen);
    this.mqDarkmode.removeListener(this.mediaListenerDarkmode);
  }

  public mediaListenerHeader(event: MediaQueryListEvent): void {
    this.$store.commit('isDesktop', event && event.matches);
  }
  public mediaListenerFullscreen(event: MediaQueryListEvent): void {
    this.$store.commit('isFullscreen', event && event.matches);
  }
  public mediaListenerDarkmode(event: MediaQueryListEvent): void {
    const matches = event && event.matches;
    document.documentElement.classList[matches ? 'add' : 'remove']('dark');
    this.$store.commit('darkmode', matches);
    this.$forceUpdate();
  }
}
</script>

<style lang="scss">
html {
  font-family: -apple-system, BlinkMacSystemFont, SF Pro Display, Inter,
    Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol;
  scroll-behavior: smooth;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;

  background: $background;
  color: $color;

  &.dark {
    background: $background_dark;
    color: $color_dark;
  }
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
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
  padding: calc(20px + env(safe-area-inset-bottom)) 5vw {
    top: 0px;
  }
  @media #{$isMobile} {
    padding-bottom: calc(70px + env(safe-area-inset-bottom));
  }
}
.tc-tabbar {
  .tc-badge {
    flex: 1 1 0px;
    margin: 0 2.5px;
  }
}
.tc-magic-card .tc-magic-card--background,
.tc-magic-card /deep/ .tc-magic-card--background {
  z-index: 995 !important;
}
.tc-magic-card .tc-magic-card--card,
.tc-magic-card /deep/ .tc-magic-card--card {
  z-index: 996 !important;
}

.app-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
}
.view-wrapper {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  @media #{$isDesktop} {
    @include custom-scrollbar__light();
    @media (prefers-color-scheme: dark) {
      @include custom-scrollbar__dark();
    }
  }
}
.view {
  position: relative;
  // max-height: 100vh;
}
.child-view {
  position: absolute;
  right: 0;
  left: 0;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(60px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-60px, 0);
}

.main-route-leave-active {
  opacity: 0;
  // transform: scale(0.8);
}
.main-route-enter {
  opacity: 0;
  // transform: scale(1.2);
}
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999999;
  animation: appear 0.5s ease 0.5s both;
  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

.fh-health-card {
  background: $paragraph;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }
  padding: 10px;
  border-radius: $border-radius;
}
</style>
