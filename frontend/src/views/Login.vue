<template>
  <div class="login">
    <fh-mobile-header title="Login" />
    <tc-hero :hasFixedHeader="false || false">
      <video slot="background" playsinline autoplay="autoplay" loop muted>
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-two-people-working-out-1318-small.mp4"
        />
      </video>

      <tc-list title="Willkommen zurück" :frosted="true" :dark="true">
        <br />
        <tc-list-item
          title="Sign in with Google"
          icon="google"
          @click="login('google')"
        />
        <tc-list-item
          title="Sign in with Fitbit"
          icon="assets/fitbit.svg"
          @click="login('fitbit')"
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
    </tc-hero>
    <div content>
      <div class="scroll-indicator" @click="scrollDown">
        <div class="text">Deine Vorteile</div>
        <div class="icon">
          <i class="ti-chevron-down"></i>
        </div>
      </div>
      <h1>Deine Vorteile</h1>
      <p>
        Wir bieten Dir ein Rund­um-sorglos-Paket an, das Deinen Einstieg in das
        aktive Leben durch abwechslungsreiche Tipps, Trainings- und
        Ernährungspläne deutlich erleichtert.
      </p>

      <ul>
        <li>Setze Dir Ziele</li>
        <li>Verfolge Deinen Fortschritt</li>
        <li>Gehe über Deine Grenzen hinweg</li>
        <li>Teile jeden Erfolg und Erfahrungen mit deinen Freunden</li>
        <li>Fordere Deine Freunde zu einer gemeinsamen Challenge heraus</li>
        <li>
          Inspiriere Dich durch die breite Vielfalt an Übungen und
          Trainingsplänen
        </li>
      </ul>
      <p>
        All das bietet Dir unsere App an – allerdings brauchen wir dafür ein
        paar persönliche Daten von Dir – was damit passiert, kannst Du genauer
        unter
        <tc-link tfcolor="success" routeName="privacy">Privatsphäre</tc-link>
        nachlesen. Melde Dich an und starte einen neuen gesünderen
        Lebensabschnitt! Bitte beachte dabei, dass Du mit der Anmeldung unsere
        <tc-link tfcolor="success" routeName="terms">
          Nutzungsbedingungen
        </tc-link>
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

  mounted() {
    setTimeout(() => {
      document.getElementsByTagName('video')[0].play();
    }, 100);
  }

  public scrollDown(): void {
    window.scrollTo({ top: window.innerHeight });
  }
}
</script>

<style lang="scss" scoped>
.login {
  p {
    text-align: justify;
    hyphens: auto;
  }
  .scroll-indicator {
    display: flex;
    align-items: center;
    flex-direction: column;
    @media (orientation: landscape) and (max-width: 850px) {
      display: none;
    }

    position: absolute;
    left: 50%;
    transform: translate(-50%, -100px);

    color: white;
    cursor: pointer;
    .text {
      margin-bottom: 5px;
      font-size: 18px;
      font-weight: bold;
    }
    &:hover .icon {
      border-color: #fff;
    }
    .icon {
      transition: 0.2s ease-in-out;
      border: 2px solid transparent;
      $size: 30px;
      border-radius: $size;
      width: $size;
      height: $size;
      display: grid;
      place-content: center;
    }
  }
  .tc-hero {
    height: 100vh;
    @media #{$isMobile} {
      height: calc(100vh - env(safe-area-inset-bottom) - 50px);
    }
    img,
    video {
      filter: brightness(60%);
    }
    .tc-list {
      width: 300px;
      max-width: 80vw;
    }
  }
}
</style>
