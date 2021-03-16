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
            asset="https://cdn2.pixstash.net/2020/09/10/1iAQb.png"
          />
          <FHSectionCardNormal
            title="Übungen"
            description="Kreiere Übungen, die du deinen Trainingsplänen hinzufügen kannst."
            asset="https://cdn2.pixstash.net/2020/09/10/1iGh8.png"
          />
          <FHSectionCardNormal
            title="Trainingspläne"
            description="Stelle dir einen Timer für deine Übung. Starte die Stoppuhr."
            asset="https://cdn2.pixstash.net/2020/09/10/1iEZd.png"
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
            asset="later"
          />
          <FHSectionCardNormal
            title="Kochrezepte"
            description="Finde Kochrezepte, die dein Training unterstützen und dir beim Abnehmen helfen."
            asset="later"
          />
          <FHSectionCardNormal
            title="Ernährungstipps"
            description="Informiere dich über Ernährungstipps, die dir helfen, deinen Alltag gesünder zu gestalten."
            asset="later"
          />
          <FHSectionCardNormal
            title="Trinkometer"
            description="Stay hydrated!"
            asset="https://cdn2.pixstash.net/2020/09/10/1iyE9.png"
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
            description="Sieh ein, wie viel du bereits trainiert hast. Diese Daten kannst du dir für die vergangene Woche oder den vergangenen Monat anzeigen lassen."
            asset="later"
          />

          <FHSectionCardNormal
            title="Vergleich"
            description="Vergleiche die Trainingsdaten der aktuellen Woche mit denen der letzten Woche."
            asset="https://cdn2.pixstash.net/2020/09/10/1izmW.png"
          />

          <FHSectionCardNormal
            title="Gewicht tracken"
            description="Tracke dein Gewicht, um deinen Fortschritt zu verfolgen."
            asset="https://cdn2.pixstash.net/2020/09/10/1ig5h.png"
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
            asset="https://cdn2.pixstash.net/2020/09/10/1ipNB.png"
          />
          <FHSectionCardNormal
            title="Challenges"
            description="Stelle deinen Freunden Herausforderungen, um motiviert zu bleiben."
            asset="later"
          />
          <FHSectionCardNormal
            title="Chat"
            description="Chatte mit deinen Freunden live über FitnessHub."
            asset="https://cdn2.pixstash.net/2020/09/10/1i9C5.png"
          />
          <FHSectionCardNormal
            title="Profil ansehen"
            description="Sieh die Profile deiner Freunde an."
            asset="https://cdn2.pixstash.net/2020/09/10/1iN0a.png"
          />
          <FHSectionCardNormal
            title="Teilen"
            description="Teile Übungen, Statistiken oder Erfolge mit deinen Freunden."
            asset="later"
          />
        </tl-grid>
        <div class="spacer" />
      </section>

      <section :dark="$store.getters.darkmode">
        <div class="subtitle">schnapp sie dir alle</div>
        <div class="title">Erfolge</div>
        <tl-grid minWidth="250" arrangement="auto-fill">
          <FHSectionCardNormal
            title="Erfolge freischalten"
            description="Erfolge für verschiedene Ziele frei."
            assets="later"
          />
        </tl-grid>
        <div class="spacer" />
      </section>

      <section :dark="$store.getters.darkmode">
        <div class="subtitle">schnapp sie dir alle</div>
        <div class="title">Erfolge</div>
        <tl-grid minWidth="250" arrangement="auto-fill">
          <FHSectionCardNormal
            title="Aktivitätsfeed"
            assets="later"
            description="Verfolge die Aktivitäten deiner Freunde. Erfahre, was sie für Übungen erstellt, Erfolge freigeschaltet oder Workouts abgeschlossen haben."
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
