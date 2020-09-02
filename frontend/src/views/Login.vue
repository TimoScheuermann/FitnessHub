<template>
  <div class="login">
    <tc-hero :hasFixedHeader="false" :height="200">
      <img
        src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
        slot="background"
        alt=""
      />
      <div class="info">
        <div class="title">Melde dich an</div>
        <div class="subtitle">und werde Teil der Community</div>
      </div>
    </tc-hero>
    <div content>
      <h1>Login</h1>
      <tc-list :dark="$store.getters.darkmode">
        <tc-list-item
          title="Sign in with Google"
          icon="google"
          @click="login('google')"
        />
        <tc-list-item
          title="Sign in with GitHub"
          icon="github"
          @click="login('github')"
        />
        <tc-list-item
          title="Sign in with Steam"
          icon="steam"
          @click="login('steam')"
        />
        <tc-list-item
          title="Sign in with Adobe"
          icon="adobe"
          @click="login('adobe')"
        />
        <tc-list-item
          title="Sign in with Amazon"
          icon="amazon-a"
          @click="login('amazon')"
        />
      </tc-list>
      <h1>Deine Vorteile</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti facere
        reprehenderit hic officiis, nobis esse blanditiis adipisci similique
        quaerat accusantium odio natus accusamus tenetur soluta inventore libero
        placeat velit atque?
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { signIn } from '../utils/auth';

@Component
export default class Login extends Vue {
  public login(provider = 'google') {
    signIn(provider);
  }
}
</script>

<style lang="scss" scoped>
.tc-hero {
  img {
    filter: brightness(60%);
  }
  .info {
    margin-top: env(safe-area-inset-top);
    color: #fff;
    text-align: center;
    .title {
      font-weight: 500;
      font-size: 1.4em;
    }
    .subtitle {
      font-size: 1.2em;
    }
  }
}
</style>
