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
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/d5046e80-7c73-4451-b77d-2ce227bed325.webp"
          />
          <FHSectionCardNormal
            title="Übungen"
            description="Kreiere Übungen, die du deinen Trainingsplänen hinzufügen kannst."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/61f36135-74a0-41ac-b507-5de68ffc1a6f.webp"
          />
          <FHSectionCardNormal
            title="Timer / Stoppuhr"
            description="Stelle dir einen Timer für deine Übung. Starte die Stoppuhr."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/d3c6ae79-ed37-451f-bfa7-6955d8dd6e46.webp"
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
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/58a3a831-8543-4d64-87d3-4926f0918f0f.webp"
          />
          <FHSectionCardNormal
            title="Kochrezepte"
            description="Finde Kochrezepte, die dein Training unterstützen und dir beim Abnehmen helfen."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/4ad31460-0148-4432-8213-2f1c282ca636.webp"
          />
          <FHSectionCardNormal
            title="Ernährungswiki"
            description="Informiere dich über Ernährungstipps, die dir helfen, deinen Alltag gesünder zu gestalten."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/3e5f7126-1dad-4894-8874-fd45e7b5342d.webp"
          />
          <FHSectionCardNormal
            title="Trinkometer"
            description="Stay hydrated!"
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/33e92901-df23-42df-ae38-7930f588fbe0.webp"
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
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/d7b126b7-4969-466c-8678-2ad561bad76f.webp"
          />

          <FHSectionCardNormal
            title="Gewicht tracken"
            description="Tracke dein Gewicht, um deinen Fortschritt zu verfolgen."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/366c7d65-ec8e-4768-aa36-9b0687b44ca3.webp"
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
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/49f46de3-e750-4e3f-96cd-55773848218e.webp"
          />
          <FHSectionCardNormal
            title="Chat"
            description="Chatte mit deinen Freunden live über FitnessHub."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/e30eddae-4161-4d00-9c8c-7208bd06fc9d.webp"
          />
          <FHSectionCardNormal
            title="Profil ansehen"
            description="Sieh die Profile deiner Freunde an."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/4d498130-ee6f-4888-b141-cf30e6cd93f1.webp"
          />
          <FHSectionCardNormal
            title="Telegram"
            description="Behalte mit Telegram Nachrichten der Fitnesshub im Blick."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/6bf7d3e5-bf7e-4b6c-a159-7b77557cc6db.webp"
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
            description="Verfolge die Aktivitäten deiner Freunde und erfahre, was es Neues gibt."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/5282a185-aad2-4f9d-810d-b10025263c6a.webp"
          />
          <FHSectionCardNormal
            title="Erfolge freischalten"
            description="Schalte Erfolge für verschiedene Ziele frei und teile sie über den Feed."
            asset="https://timos.s3.eu-central-1.amazonaws.com/drive/fitnesshub/406018b0-13df-44b5-9bc1-b5045ef097d2.webp"
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
