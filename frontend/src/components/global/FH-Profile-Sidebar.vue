<template>
  <transition name="appear">
    <div
      class="fh-profile-sidebar"
      v-if="
        $store.getters.isFullscreen &&
          $store.getters.valid &&
          $route.name !== 'profile'
      "
    >
      <div class="fh-profile-sidebar--container">
        <div class="fh-profile-sidebar--head">
          <img src="assets/hero/fh-hero-blur.webp" alt="" />
          <div class="container">
            <fh-avatar size="small" />
            <div class="info" v-if="$store.getters.valid">
              <div class="name">{{ name }}</div>
              <div class="date">Mitglied seit: {{ transformDate() }}</div>
            </div>
          </div>
        </div>

        <div class="fh-profile-sidebar--content">
          <view-profile :isInSidebar="true" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Profile from '@/views/profile/Profile.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'view-profile': Profile
  }
})
export default class FHProfileSidebar extends Vue {
  /**
   * returns users givenname and familyname
   */
  get name(): string {
    const user = this.$store.getters.user;
    return [user.givenName, user.familyName].filter(x => !!x).join(' ');
  }

  /**
   * transform given timestamp to Date
   */
  public transformDate(timestamp = this.$store.getters.user.date): string {
    const date = new Date(timestamp);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }
}
</script>

<style lang="scss" scoped>
.appear-enter-active,
.appear-leave-active {
  transition: max-width 0.5s;
}
.appear-enter,
.appear-leave-to {
  max-width: 0px;
}
.appear-enter-to,
.appear-leave {
  max-width: 315px;
}
.fh-profile-sidebar {
  box-shadow: $shadow;
  height: 100vh;
  width: 315px;
  overflow-x: hidden;
  overflow-y: auto;
  @media #{$isDesktop} {
    @include custom-scrollbar__light();
    @media (prefers-color-scheme: dark) {
      @include custom-scrollbar__dark();
    }
  }
  .fh-profile-sidebar--container {
    .fh-profile-sidebar--content {
      padding: 20px;
    }
    .fh-profile-sidebar--head {
      position: sticky;
      top: 0;
      z-index: 20;
      height: 200px;

      img {
        height: 200px;
        width: 100%;
        object-fit: cover;
      }
      .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        @include backdrop-blur($paragraph);
        @media (prefers-color-scheme: dark) {
          @include backdrop-blur($paragraph_dark);
        }
        .info {
          margin-top: 10px;
          .name {
            font-weight: 500;
            font-size: 1.2em;
          }
          .date {
            margin-top: 5px;
            opacity: 0.75;
          }
        }
      }
    }
  }
}
</style>
