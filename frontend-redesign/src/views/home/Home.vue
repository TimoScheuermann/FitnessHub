<template>
  <div class="view-Home" content>
    <div max-width>
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
    <FHLargeHeadline title="Workouts" />
    <br />
    <tl-flow>
      <FHFeatureCard
        title="Trainingspläne"
        image="https://cdn2.pixstash.net/2020/09/10/1iAQb.png"
      >
        Erstelle Trainingspläne, die dir helfen, dein Trainingsziel zu
        erreichen.
      </FHFeatureCard>
      <FHFeatureCard
        title="Übungen"
        image="https://cdn2.pixstash.net/2020/09/10/1iGh8.png"
      >
        Kreiere Übungen, die du deinen Trainingsplänen hinzufügen kannst.
      </FHFeatureCard>
      <FHFeatureCard
        title="Timer / Stoppuhr"
        image="https://cdn2.pixstash.net/2020/09/10/1iEZd.png"
      >
        Stelle dir einen Timer für deine Übung. Starte die Stoppuhr.
      </FHFeatureCard>
    </tl-flow>
    <br />
    <br />
    <FHLargeHeadline title="Ernährung" />
    <br />
    <tl-flow>
      <FHFeatureCard title="Ernährungspläne" image="later">
        Ernährungspläne geben dir eine Hilfestellung beim Erreichen deiner
        Traumfigur.
      </FHFeatureCard>
      <FHFeatureCard title="Kochrezepte" image="later">
        Finde Kochrezepte, die dein Training unterstützen und dir beim Abnehmen
        helfen.
      </FHFeatureCard>
      <FHFeatureCard title="Ernährungstipps" image="later">
        Informiere dich über Ernährungstipps, die dir helfen, deinen Alltag
        gesünder zu gestalten.
      </FHFeatureCard>
      <FHFeatureCard
        title="Trinkometer"
        image="https://cdn2.pixstash.net/2020/09/10/1iyE9.png"
      >
        Stay hydrated!
      </FHFeatureCard>
    </tl-flow>
    <br />
    <br />
    <FHLargeHeadline title="Statistik" />
    <br />
    <tl-flow>
      <FHFeatureCard title="Trainingsstatistik" image="later">
        Sieh ein, wie viel du bereits trainiert hast. Diese Daten kannst du dir
        für die vergangene Woche oder den vergangenen Monat anzeigen lassen.
      </FHFeatureCard>
      <FHFeatureCard
        title="Vergleich"
        image="https://cdn2.pixstash.net/2020/09/10/1izmW.png"
      >
        Vergleiche die Trainingsdaten der aktuellen Woche mit denen der letzten
        Woche.
      </FHFeatureCard>
      <FHFeatureCard
        title="Gewicht tracken"
        image="https://cdn2.pixstash.net/2020/09/10/1ig5h.png"
      >
        Tracke dein Gewicht, um deinen Fortschritt zu verfolgen.
      </FHFeatureCard>
    </tl-flow>
    <br />
    <br />
    <FHLargeHeadline title="Freunde" />
    <br />
    <tl-flow>
      <FHFeatureCard
        title="Freunde hinzufügen"
        image="https://cdn2.pixstash.net/2020/09/10/1ipNB.png"
      >
        Füge Freunde in deinem FitnessHub hinzu.
      </FHFeatureCard>
      <FHFeatureCard title="Challenges" image="later">
        Stelle deinen Freunden Herausforderungen, um motiviert zu bleiben.
      </FHFeatureCard>
      <FHFeatureCard
        title="Chat"
        image="https://cdn2.pixstash.net/2020/09/10/1i9C5.png"
      >
        Chatte mit deinen Freunden live über FitnessHub.
      </FHFeatureCard>
      <FHFeatureCard
        title="Profil ansehen"
        image="https://cdn2.pixstash.net/2020/09/10/1iN0a.png"
      >
        Sieh die Profile deiner Freunde an.
      </FHFeatureCard>
      <FHFeatureCard title="Teilen" image="later">
        Teile Übungen, Statistiken oder Erfolge mit deinen Freunden.
      </FHFeatureCard>
    </tl-flow>
    <br />
    <br />
    <FHLargeHeadline title="Erfolge" />
    <br />
    <tl-flow>
      <FHFeatureCard title="Erfolge freischalten" image="later">
        Schalte Erfolge für verschiedene Ziele frei.
      </FHFeatureCard>
    </tl-flow>
    <br />
    <br />
    <FHLargeHeadline title="Feed" />
    <br />
    <tl-flow>
      <FHFeatureCard title="Aktivitätsfeed" image="later">
        Verfolge die Aktivitäten deiner Freunde. Erfahre, was sie für Übungen
        erstellt, Erfolge freigeschaltet oder Workouts abgeschlossen haben.
      </FHFeatureCard>
    </tl-flow>
    </div>
  </div>
</template>

<script lang="ts">
import FHFeatureCard from '@/components/home/FHFeatureCard.vue';
import FHLargeHeadline from '@/components/home/FHLargeHeadline.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHFeatureCard,
    FHLargeHeadline
  }
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped></style>
