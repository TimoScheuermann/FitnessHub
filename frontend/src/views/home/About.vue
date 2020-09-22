<template>
  <div class="about" content>
    <h1>About</h1>
    <p>
      FitnessHub ist eine Online-Oase für alle Sportenthusiasten, Sportmuffel
      und Profis, die unabhängig von Ihrem Geschlecht, Alter und Fitnesslevel
      sich für ein gesundes, aktives und bewussteres Leben entscheiden wollen.
      Als eine Kombination aus Trainings- und Ernährungsapp, ermöglicht
      FitnessHub eine digitale und personalisierte Begleitung bei der Erreichung
      der persönlichen Fitnessziele.
    </p>
    <br />
    <br />
    <fh-large-headline title="Workouts" />
    <br />
    <tl-flow>
      <fh-feature-card
        title="Trainingspläne"
        image="https://cdn2.pixstash.net/2020/09/10/1iAQb.png"
      >
        Erstelle Trainingspläne, die dir helfen, dein Trainingsziel zu
        erreichen.
      </fh-feature-card>
      <fh-feature-card
        title="Übungen"
        image="https://cdn2.pixstash.net/2020/09/10/1iGh8.png"
      >
        Kreiere Übungen, die du deinen Trainingsplänen hinzufügen kannst.
      </fh-feature-card>
      <fh-feature-card
        title="Timer / Stoppuhr"
        image="https://cdn2.pixstash.net/2020/09/10/1iEZd.png"
      >
        Stelle dir einen Timer für deine Übung. Starte die Stoppuhr.
      </fh-feature-card>
    </tl-flow>
    <br />
    <br />
    <fh-large-headline title="Ernährung" />
    <br />
    <tl-flow>
      <fh-feature-card title="Ernährungspläne" image="later">
        Ernährungspläne geben dir eine Hilfestellung beim Erreichen deiner
        Traumfigur.
      </fh-feature-card>
      <fh-feature-card title="Kochrezepte" image="later">
        Finde Kochrezepte, die dein Training unterstützen und dir beim Abnehmen
        helfen.
      </fh-feature-card>
      <fh-feature-card title="Ernährungstipps" image="later">
        Informiere dich über Ernährungstipps, die dir helfen, deinen Alltag
        gesünder zu gestalten.
      </fh-feature-card>
      <fh-feature-card
        title="Trinkometer"
        image="https://cdn2.pixstash.net/2020/09/10/1iyE9.png"
      >
        Stay hydrated!
      </fh-feature-card>
    </tl-flow>
    <br />
    <br />
    <fh-large-headline title="Statistik" />
    <br />
    <tl-flow>
      <fh-feature-card title="Trainingsstatistik" image="later">
        Sieh ein, wie viel du bereits trainiert hast. Diese Daten kannst du dir
        für die vergangene Woche oder den vergangenen Monat anzeigen lassen.
      </fh-feature-card>
      <fh-feature-card
        title="Vergleich"
        image="https://cdn2.pixstash.net/2020/09/10/1izmW.png"
      >
        Vergleiche die Trainingsdaten der aktuellen Woche mit denen der letzten
        Woche.
      </fh-feature-card>
      <fh-feature-card
        title="Gewicht tracken"
        image="https://cdn2.pixstash.net/2020/09/10/1ig5h.png"
      >
        Tracke dein Gewicht, um deinen Fortschritt zu verfolgen.
      </fh-feature-card>
    </tl-flow>
    <br />
    <br />
    <fh-large-headline title="Freunde" />
    <br />
    <tl-flow>
      <fh-feature-card
        title="Freunde hinzufügen"
        image="https://cdn2.pixstash.net/2020/09/10/1ipNB.png"
      >
        Füge Freunde in deinem FitnessHub hinzu.
      </fh-feature-card>
      <fh-feature-card title="Challenges" image="later">
        Stelle deinen Freunden Herausforderungen, um motiviert zu bleiben.
      </fh-feature-card>
      <fh-feature-card
        title="Chat"
        image="https://cdn2.pixstash.net/2020/09/10/1i9C5.png"
      >
        Chatte mit deinen Freunden live über FitnessHub.
      </fh-feature-card>
      <fh-feature-card
        title="Profil ansehen"
        image="https://cdn2.pixstash.net/2020/09/10/1iN0a.png"
      >
        Sieh die Profile deiner Freunde an.
      </fh-feature-card>
      <fh-feature-card title="Teilen" image="later">
        Teile Übungen, Statistiken oder Erfolge mit deinen Freunden.
      </fh-feature-card>
    </tl-flow>
    <br />
    <br />
    <fh-large-headline title="Erfolge" />
    <br />
    <tl-flow>
      <fh-feature-card title="Erfolge freischalten" image="later">
        Schalte Erfolge für verschiedene Ziele frei.
      </fh-feature-card>
    </tl-flow>
    <br />
    <br />
    <fh-large-headline title="Feed" />
    <br />
    <tl-flow>
      <fh-feature-card title="Aktivitätsfeed" image="later">
        Verfolge die Aktivitäten deiner Freunde. Erfahre, was sie für Übungen
        erstellt, Erfolge freigeschaltet oder Workouts abgeschlossen haben.
      </fh-feature-card>
    </tl-flow>
  </div>
</template>

<script lang="ts">
import FHFeatureCard from '@/components/about/FH-FeatureCard.vue';
import FHLargeHeadline from '@/components/about/FH-LargeHeadline.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-feature-card': FHFeatureCard,
    'fh-large-headline': FHLargeHeadline
  }
})
export default class About extends Vue {}
</script>

<style lang="scss" scoped>
.about {
  .tl-flow {
    margin: 0 -10px;
  }
}
</style>
