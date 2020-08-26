<template>
  <div class="login">
    <tc-hero :dark="true">
      <img
        src="https://images.unsplash.com/photo-1517344368193-41552b6ad3f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
        slot="background"
        alt=""
      />
      <tl-flow flow="column">
        <h1>Melde dich an</h1>
        <h2>und werde Teil der Community</h2>
      </tl-flow>
    </tc-hero>
    <div content>
      <h1>Login</h1>
      <tl-grid gap="30px 0px">
        <tc-button
          variant="filled"
          background="#000"
          color="#fff"
          name="Sign in with Google"
          icon="google"
          @click="login('google')"
        />
        <tc-button
          variant="filled"
          background="#000"
          color="#fff"
          name="Sign in with GitHub"
          icon="github"
          @click="login('github')"
        />
        <tc-button
          variant="filled"
          background="#000"
          color="#fff"
          name="Sign in with Adobe"
          icon="adobe"
          @click="login('adobe')"
        />
        <tc-button
          variant="filled"
          background="#000"
          color="#fff"
          name="Sign in with Amazon"
          icon="amazon-a"
          @click="login('amazon')"
        />
        <tc-button
          variant="filled"
          background="#000"
          color="#fff"
          name="Sign in with Steam"
          icon="steam"
          @click="login('steam')"
        />
      </tl-grid>
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
    filter: brightness(80%);
  }
  .tl-flow {
    h1,
    h2 {
      margin: 2.5px 0;
      text-align: center;
    }
  }
}
[content] {
  padding-top: 0;
}
</style>
