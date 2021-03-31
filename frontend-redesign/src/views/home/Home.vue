<template>
  <div class="view-home" content>
    <div max-width>
      <tl-flow class="header" horizontal="start">
        <tl-flow>
          <img src="assets/fh.svg" alt="" />
        </tl-flow>
        <h1>About</h1>
      </tl-flow>

      <p>
        FitnessHub ist eine Online-Oase für alle Sportenthusiasten, Sportmuffel
        und Profis, die unabhängig von Ihrem Geschlecht, Alter und Fitnesslevel
        sich für ein gesundes, aktives und bewussteres Leben entscheiden wollen.
        Als eine Kombination aus Trainings- und Ernährungsapp, ermöglicht
        FitnessHub eine digitale und personalisierte Begleitung bei der
        Erreichung der persönlichen Fitnessziele.
      </p>

      <section :dark="$store.getters.darkmode">
        <div class="subtitle">Erstellen, Planen, Teilen</div>
        <div class="title">Workouts</div>
        <tl-grid minWidth="250" arrangement="auto-fill">
          <FHSectionCardNormal
            title="Trainingspläne"
            description="Erstelle Trainingspläne, die dir helfen, dein Trainingsziel zu erreichen."
            asset="assets/landing/Trainingsplan.png"
          />
          <FHSectionCardNormal
            title="Übungen"
            description="Kreiere Übungen, die du deinen Trainingsplänen hinzufügen kannst."
            asset="assets/landing/Übung.png"
          />
          <FHSectionCardNormal
            title="Timer / Stoppuhr"
            description="Stelle dir einen Timer für deine Übung. Starte die Stoppuhr."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/e54504c0-d83f-431d-a0c3-e0139a737907.webp"
          />
        </tl-grid>
        <div class="spacer" />
      </section>

      <section :dark="$store.getters.darkmode">
        <div class="subtitle">Rezepte, Tipps & mehr</div>
        <div class="title">Ernährung</div>
        <tl-grid minWidth="250" arrangement="auto-fill">
          <FHSectionCardNormal
            title="Ernährungspläne"
            description="Ernährungspläne geben dir eine Hilfestellung beim Erreichen deiner Traumfigur."
            asset="assets/landing/Ernährungsplan.png"
          />
          <FHSectionCardNormal
            title="Kochrezepte"
            description="Finde Kochrezepte, die dein Training unterstützen und dir beim Abnehmen helfen."
            asset="assets/landing/Rezepte.png"
          />
          <FHSectionCardNormal
            title="Ernährungswiki"
            description="Informiere dich über Ernährungstipps, die dir helfen, deinen Alltag gesünder zu gestalten."
            asset="assets/landing/Ernährungswiki.png"
          />
          <FHSectionCardNormal
            title="Trinkometer"
            description="Stay hydrated!"
            asset="assets/landing/Trinkometer.png"
          />
        </tl-grid>
        <div class="spacer" />
      </section>

      <section :dark="$store.getters.darkmode">
        <div class="subtitle">Verfolgen, Vergleichen, Verbessern</div>
        <div class="title">Statistik</div>
        <tl-grid minWidth="250" arrangement="auto-fill">
          <FHSectionCardNormal
            title="Trainingsstatistik"
            description="Schau dir an, wie viel du bereits trainiert hast. Vergleiche es mit deiner Trainingshistorie."
            asset="https://cdn2.pixstash.net/2020/09/10/1izmW.png"
          />

          <FHSectionCardNormal
            title="Gewicht tracken"
            description="Tracke dein Gewicht, um deinen Fortschritt zu verfolgen."
            asset="assets/landing/Gewichtsverlauf.png"
          />
        </tl-grid>
        <div class="spacer" />
      </section>

      <section :dark="$store.getters.darkmode">
        <div class="subtitle">Better together</div>
        <div class="title">Freunde</div>
        <tl-grid minWidth="250" arrangement="auto-fill">
          <FHSectionCardNormal
            title="Freunde hinzufügen"
            description="Füge Freunde in deinem FitnessHub hinzu."
            asset="assets/landing/Freunde\ hinzufügen.png"
          />
          <FHSectionCardNormal
            title="Chat"
            description="Chatte mit deinen Freunden live über FitnessHub."
            asset="assets/landing/Chat.png"
          />
          <FHSectionCardNormal
            title="Profil ansehen"
            description="Sieh die Profile deiner Freunde an."
            asset="assets/landing/Profil\ ansehen.png"
          />
          <FHSectionCardNormal
            title="Telegram"
            description="Behalte mit Telegram Nachrichten der Fitnesshub im Blick."
            asset="assets/landing/Telegram.png"
          />
        </tl-grid>
        <div class="spacer" />
      </section>

      <section :dark="$store.getters.darkmode">
        <div class="subtitle">Neuigkeiten & Erfolge</div>
        <div class="title">Feed</div>
        <tl-grid minWidth="250" arrangement="auto-fill">
          <FHSectionCardNormal
            title="Aktivitätsfeed"
            description="Verfolge die Aktivitäten deiner Freunde und erfahre, was es Neues giebt."
            asset="assets/landing/Aktivitätsfeed.png"
          />
          <FHSectionCardNormal
            title="Erfolge freischalten"
            description="Schalte Erfolge für verschiedene Ziele frei und teile sie über den Feed."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/0718bf11-a37a-4c81-a8b8-e0bd5dc772bb.webp"
          />
        </tl-grid>
        <div class="spacer" />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import FHSectionCardLarge from '@/components/home/FHSectionCardLarge.vue';
import FHSectionCardNormal from '@/components/home/FHSectionCardNormal.vue';
import { IExercise } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHSectionCardNormal,
    FHSectionCardLarge
  }
})
export default class Home extends Vue {
  public ex: IExercise = {
    steps: ['Imitiert Ski-Langlauf'],
    warnings: ['Schutz der Gelenke', 'Ausdauertraining', 'Gewichtsreduktion'],
    affectedMuscles: [
      'Cardio',
      'Ganzkörper',
      'Gluteus Maximus',
      'Oberschenkel'
    ],
    _id: '5f573424b3bda65094e5a4bb',
    title: 'Arc Trainer',
    thumbnail: 'https://cdn2.pixstash.net/2020/09/09/1uxvm.jpg',
    difficulty: 1,
    distance: '5 km',
    created: 1599550500990,
    reviewedBy: '5f47a68688e01f1eaa1881d9',
    reviewed: true,
    updated: 1614805273365,
    author: '5f47a68688e01f1eaa1881d9',
    kneeFriendly: true
  };
}
</script>

<style lang="scss" scoped>
.view-home {
  .header {
    .tl-flow {
      margin-right: 10px;
      img {
        height: 40px;
        filter: brightness(0%);
        @media #{$isDark} {
          filter: brightness(100%);
        }
      }
    }
  }
  section {
    animation: move-up 0.4s ease-in-out 0.3s both;
    background: $paragraph;
    &[dark] {
      background: $paragraph_dark;
    }
    text-align: center;
    border-radius: $border-radius;
    margin: 30px -5vw;
    padding: 20px 5vw 0;
    .spacer {
      height: 5vw;
      max-height: 60px;
    }
    .spacer-small {
      height: 30px;
    }
    .title,
    .subtitle {
      text-align: center;
    }
    .title {
      font-weight: bold;
      font-size: 25px;
      margin-bottom: 30px;
    }
    .subtitle {
      font-size: 13px;
      font-weight: bold;
      opacity: 0.75;
      margin-top: 10px;
      text-transform: uppercase;
    }
  }
}

.level {
  margin-left: 10px;
  opacity: 0.7;
  span {
    font-size: 14px;
  }
  i {
    margin-left: 5px;
    font-size: 10px;

    &[difficulty='1'] {
      color: $success;
    }
    &[difficulty='2'] {
      color: $alarm;
    }
    &[difficulty='3'] {
      color: $error;
    }
  }
}
</style>
