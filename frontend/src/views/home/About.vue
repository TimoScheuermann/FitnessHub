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
    <h1>Workouts</h1>
    <p>
      Die App soll den Benutzern eine breite Vielfalt an Trainingsplänen mit
      verschiedenen Schwierigkeitsgraden anbieten und zeigen, welche Übungen es
      für bestimmte Muskelgruppen gibt und wie sie richtig auszuführen sind.
    </p>
    <tl-grid>
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
    </tl-grid>
    <fh-feature-card
      title="Timer / Stoppuhr"
      image="https://cdn2.pixstash.net/2020/09/10/1iEZd.png"
      standalone="below"
    >
      Stelle dir einen Timer für deine Übung. Starte die Stoppuhr.
    </fh-feature-card>
    <h1>Ernährung</h1>
    <p>
      Die Ernährung spielt neben dem Training eine sehr große Rolle. Ausgewogene
      und gesunde Ernährung sind elementar zum Erreichen deines Trainingsziels.
    </p>
    <tl-grid>
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
    </tl-grid>
    <h1>Statistik</h1>
    <p>
      Durch die Logbuchfunktion kann jeder Benutzer seine Trainingseinheiten
      protokollieren und so seinen Fortschritt verfolgen.
    </p>
    <fh-feature-card
      title="Trainingsstatistik"
      image="later"
      standalone="above"
    >
      Sieh ein, wie viel du bereits trainiert hast. Diese Daten kannst du dir
      für die vergangene Woche oder den vergangenen Monat anzeigen lassen.
    </fh-feature-card>
    <tl-grid>
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
    </tl-grid>
    <h1>Freunde</h1>
    <p>
      Damit die Motivation und der Spaßfaktor nicht unter dem Training leiden,
      bietet die App neben der integrierten Chatfunktion auch die Möglichkeit
      zur Erstellung von Challenges, die zur Steigerung der Motivation
      beitragen.
    </p>
    <tl-grid>
      <fh-feature-card
        title="Freunde hinzufügen"
        image="https://cdn2.pixstash.net/2020/09/10/1ipNB.png"
      >
        Füge Freunde in deinem FitnessHub hinzu.
      </fh-feature-card>
      <fh-feature-card title="Challenges" image="later">
        Stelle deinen Freunden Herausforderungen, um motiviert zu bleiben.
      </fh-feature-card>
    </tl-grid>
    <fh-feature-card
      standalone="below"
      title="Chat"
      image="https://cdn2.pixstash.net/2020/09/10/1i9C5.png"
    >
      Chatte mit deinen Freunden live über FitnessHub.
    </fh-feature-card>
    <tl-grid minWidth="200" standalone="below">
      <fh-feature-card
        title="Profil ansehen"
        image="https://cdn2.pixstash.net/2020/09/10/1iN0a.png"
      >
        Sieh die Profile deiner Freunde an.
      </fh-feature-card>
      <fh-feature-card title="Teilen" image="later">
        Teile Übungen, Statistiken oder Erfolge mit deinen Freunden.
      </fh-feature-card>
    </tl-grid>
    <h1>Erfolge</h1>
    <p>
      Erfolge motivieren dich, neue Übungen auszuprobieren und alte Rekorde zu
      überbieten.
    </p>
    <tl-grid>
      <fh-feature-card title="Erfolge freischalten" image="later">
        Schalte Erfolge für verschiedene Ziele frei.
      </fh-feature-card>
    </tl-grid>
    <h1>Feed</h1>
    <tl-grid>
      <fh-feature-card title="Aktivitätsfeed" image="later">
        Verfolge die Aktivitäten deiner Freunde. Erfahre, was sie für Übungen
        erstellt, Erfolge freigeschaltet oder Workouts abgeschlossen haben.
      </fh-feature-card>
    </tl-grid>
  </div>
</template>

<script lang="ts">
import FHFeatureCard from '@/components/about/FH-FeatureCard.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    'fh-feature-card': FHFeatureCard
  }
})
export default class About extends Vue {}
</script>

<style lang="scss" scoped>
.about {
  h1 {
    color: $success;
  }
  [standalone='below'] {
    margin-top: 30px;
  }
  [standalone='above'] {
    margin-bottom: 30px;
  }
}
</style>