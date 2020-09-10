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
        Wir bieten Dir ein Rund­um-sorglos-Paket an, das Deinen Einstieg in das
        aktive Leben durch abwechslungsreiche Tipps, Trainings- und
        Ernährungspläne deutlich erleichtert. Setze Dir Ziele und verfolge
        täglich Deinen Fortschritt. Lass Dich durch die breite Vielfalt an
        Übungen und Trainingsplänen inspirieren und motivieren. Teile jeden
        Erfolg mit den Freunden und geh über Deine Grenzen hinaus. Tausche
        Erfahrungen oder fordere Deine Freunde zu einer gemeinsamen Challenge
        heraus. All das bietet Dir unsere App an – allerdings brauchen wir dafür
        ein paar persönliche Daten von Dir – was damit passiert, kannst Du
        genauer unter
        <tc-link tfcolor="success" routeName="privacy">Privatsphäre</tc-link>
        nachlesen. Melde Dich an und starte einen neuen gesünderen
        Lebensabschnitt! Bitte beachte dabei, dass Du mit der Anmeldung unsere
        <tc-link tfcolor="success" routeName="terms"
          >Nutzungsbedingungen</tc-link
        >
        automatisch akzeptierst.
      </p>
      <p>Viel Spaß, Schweiß und Erfolge wünscht Dir Dein Fitnesshub Team!</p>
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
p {
  text-align: justify;
  hyphens: auto;
}
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
