<template>
  <div class="view-Login">
    <FHHeader title="Login">
      <FHFullScreenCloser @click="$cFS('home')" />
    </FHHeader>

    <div class="login-wrapper">
      <FHSwipeable @swipeDown="$cFS('home')">
        <tl-flow flow="column">
          <img src="pwa/maskIcon.svg" height="70" alt="" />
          <h1>FitnessHub</h1>
        </tl-flow>
      </FHSwipeable>
      <div content>
        <div max-width>
          <tc-list-item
            cursor
            title="Sign in with Google"
            icon="google"
            @click="login('google')"
          />
          <!-- <tc-list-item
            cursor
            title="Sign in with Fitbit"
            icon="assets/fitbit.svg"
            @click="login('fitbit')"
          /> -->
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
          <!-- <tc-list-item
            cursor
            title="Sign in with Adobe"
            icon="adobe"
            @click="login('adobe')"
          /> -->
          <tc-list-item
            cursor
            title="Sign in with Amazon"
            icon="amazon-a"
            @click="login('amazon')"
          />
        </div>
      </div>
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
  color: #fff;

  .login-wrapper {
    min-height: 100vh;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('/assets/login-bg.webp'),
      linear-gradient(
        to bottom,
        rgba(#111, 0.4) calc(200px + env(safe-area-inset-top)),
        rgba(#111, 0),
        rgba(#111, 0.8) calc(100% - 100px),
        rgba(#111, 0.8)
      );
    background-blend-mode: multiply;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    [content] {
      padding: 50px 5vw calc(20px + env(safe-area-inset-bottom));
      @media #{$isDesktop} {
        padding-bottom: 5vw;
      }
    }

    .tl-flow {
      padding: calc(50px + env(safe-area-inset-top)) 0;
      h1 {
        margin: 0;
      }
    }
  }
}
</style>
