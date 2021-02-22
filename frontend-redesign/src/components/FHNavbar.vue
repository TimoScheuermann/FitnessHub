<template>
  <tc-navbar
    transition
    :moveout="$route.meta.fullscreen"
    :dark="$store.getters.darkmode"
  >
    <tc-navbar-item
      tfcolor="success"
      icon="house"
      name="Start"
      routeName="home"
    />
    <tc-navbar-item
      tfcolor="success"
      icon="star"
      name="Feed"
      routeName="community"
    />
    <tc-navbar-item
      tfcolor="success"
      icon="gym"
      name="Training"
      routeName="training"
    />
    <tc-navbar-item
      tfcolor="success"
      icon="apple-alt"
      name="Ernährung"
      routeName="nutrition"
    />
    <tl-flow v-if="!$store.getters.valid">
      <tc-button
        variant="filled"
        tfbackground="success"
        name="Login"
        icon="login"
        @click="$oFS('login')"
      />
    </tl-flow>
    <tl-flow v-else>
      <div @click="navProfile">
        <tl-flow class="account" cursor>
          <tc-avatar :src="$store.getters.user.avatar" />
          <div class="name" :active="$route.name === 'profile'">Profil</div>
          <div class="badge" v-if="profileNotifications > 0">
            {{ profileNotifications }}
          </div>
        </tl-flow>
      </div>
    </tl-flow>
  </tc-navbar>
</template>

<script lang="ts">
import { NotificationManagement } from '@/utils/NotificationManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHNavbar extends Vue {
  public navProfile(): void {
    if (this.$route.name !== 'profile') this.$router.push({ name: 'profile' });
  }

  get profileNotifications(): number {
    return NotificationManagement.getTotalNotifications();
  }
}
</script>

<style lang="scss" scoped>
.tc-navbar {
  @media #{$isMobile} {
    display: none !important;
  }
  &[moveout] {
    transform: translateY(calc(-50px - env(safe-area-inset-top)));
  }

  .account {
    padding: 0 5px;
    border-left: 1px solid rgba(#fff, 0.2);
    padding-left: 10px;

    &:hover .name {
      opacity: 1;
    }

    .tc-avatar {
      height: 30px;
      width: 30px;
      margin-right: 10px;
    }
    .name {
      margin-right: 5px;
      padding-right: 5px;
      opacity: 0.5;
      transition: 0.2s ease-in-out;
      &[active] {
        opacity: 1;
      }
    }
    .badge {
      font-size: 12px;
      color: #fff;
      $scale: 20px;
      height: $scale;
      padding: 0px #{$scale / 3};
      min-width: #{$scale / 3};
      border-radius: $scale;
      line-height: $scale;
      text-align: center;
      background: $success;
      margin: 0 5px;
    }
  }
}
</style>
