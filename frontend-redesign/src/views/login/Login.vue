<template>
  <div class="view-Login">
    <FHHeader title="Login">
      <FHFullScreenCloser @click="$cFS('home')" />
    </FHHeader>

    <FHSwipeable @swipeDown="$cFS('home')">
      <tl-flow flow="column">
        <img src="pwa/maskIcon.svg" height="70" alt="" />
        <h1>FitnessHub</h1>
      </tl-flow>
    </FHSwipeable>

    <div class="list-items">
      <tc-list-item
        cursor
        title="Sign in with Google"
        icon="google"
        @click="login('google')"
      />
      <tc-list-item
        cursor
        title="Sign in with GitHub"
        icon="github"
        @click="login('github')"
      />
      <tc-list-item
        cursor
        title="Sign in with Steam"
        icon="steam"
        @click="login('steam')"
      />
      <tc-list-item
        cursor
        title="Sign in with Amazon"
        icon="amazon-a"
        @click="login('amazon')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import FHFullScreenCloser from '@/components/FHFullScreenCloser.vue';
import FHHeader from '@/components/FHHeader.vue';
import FHSwipeable from '@/components/FHSwipeable.vue';
import { signIn } from '@/utils/auth';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFullScreenCloser,
    FHSwipeable,
    FHHeader
  }
})
export default class Login extends Vue {
  public login(provider = 'google') {
    signIn(provider);
  }
}
</script>

<style lang="scss" scoped>
.view-Login {
  min-height: 100vh;
  color: #fff;

  background: linear-gradient(rgba($color, 0), rgba($color, 0.5)),
    url('/assets/login-bg.webp');
  background-size: cover;
  background-position: center center;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .tl-flow {
    padding: calc(50px + env(safe-area-inset-top)) 0;
    h1 {
      margin: 0;
    }
  }

  .list-items {
    width: calc(100% - 10vw);
    max-width: 400px;
    margin: 0 auto;

    padding: 0 5vw calc(20px + env(safe-area-inset-bottom));
    @media #{$isDesktop} {
      padding-bottom: 5vw;
    }
  }
}
</style>
