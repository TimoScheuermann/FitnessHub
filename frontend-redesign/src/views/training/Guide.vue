<template>
  <div class="view-muscle-guide" content>
    <div max-width>
      <h1>Muskelguide</h1>
      Du willst deinen Körper besser formen und dafür gezielt die Problemzonen
      trainieren? Kein Problem. Wir haben unsere Übungen nach betroffenen
      Muskeln sortiert – schau mal rein*. <br />* Falls du allerdings den
      Anatomieunterricht geschwänzt hast und totaler Fitnessanfänger bist, lohnt
      es sich diesen kurzen Muskelguide durchzulesen. Hier kannst du erfahren,
      wo der aufgelistete Muskel sich befindet und warum er trainiert werden
      sollte.

      <h2>Oberkörper</h2>
      Im Gegensatz zu den Frauen, befinden sich die Baustellen der Männer
      meistens in der oberen Körperhälfte. Der Wunsch nach definiertem Bauch und
      Brust, starken Schultern und breitem Armumfang (= V-Form) lässt sich
      leichter erfüllen, wenn du weißt welche Muskeln sich überhaupt im
      Oberkörper befinden.
      <br />
      <br />
      <masonry :cols="{ default: 2, 600: 1 }" gutter="20px">
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Bizeps"
          :dark="$store.getters.darkmode"
        >
          DAS Statussymbol für echte Kerle. Befindet sich im Oberarm und hat
          zwei Muskelstränge, die am besten gleich stark trainiert werden
          sollten – sonst könnte es zu Muskelproblemen kommen, die infolge des
          Ungleichgewichts in der Muskelstärke entstehen.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Deltamuskel"
          :dark="$store.getters.darkmode"
        >
          er gehört zu der Gruppe der Schulter- und Nackenmuskeln. Er „verpackt“
          das Schultergelenk, verleiht der Schulter seine Kontur und bildet den
          äußersten Punkt der V-Form. Er ist für die Hebung des Armes zur Seite
          verantwortlich und kann bei Vernachlässigung ebenfalls Schmerzen in
          den Oberarmen und Schulter verursachen.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Handstrecker"
          :dark="$store.getters.darkmode"
        >
          dieser Muskel ist für den sog. Tennisellenbogen verantwortlich und
          befindet sich auf der Oberseite deines Unterarms.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Latissimus"
          :dark="$store.getters.darkmode"
        >
          ist der größte Skelettmuskel und befindet sich an der seitlichen
          Rückenmuskulatur. Wenn du diesen trainierst, erscheint dein Rücken
          breiter und erreichst so einfacher die gewünschte V-Form.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Pectoralis"
          :dark="$store.getters.darkmode"
        >
          Brustmuskel, der für definierte und starke Brustmuskulatur
          verantwortlich ist.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Trapezmuskel"
          :dark="$store.getters.darkmode"
        >
          liegt im oberen, zentralen Bereich des Rückens und Nackens und trägt
          zu deinem „Stiernacken“ bei.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Trizeps"
          :dark="$store.getters.darkmode"
        >
          ist der Gegenspieler vom Bizeps und befindet sich auf der Rückseite
          des Oberarms.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Vorderer Sägemuskel"
          :dark="$store.getters.darkmode"
        >
          liegt seitlich unterhalb der Brust. Unter anderem ist der Muskel auch
          als Boxer-Muskel bekannt. Bei diesen Sportlern ist er ständig im
          Einsatz und deshalb auch besonders ausgeprägt.
        </tc-card>
      </masonry>

      <h2>Unterkörper</h2>
      Falls deine Problemzonen sich unterhalb der Bauchnabel befinden musst du
      diese Muskelgruppen unbedingt kennen.
      <br />
      <br />
      <masonry :cols="{ default: 2, 600: 1 }" gutter="20px">
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Adduktor"
          :dark="$store.getters.darkmode"
        >
          ist die Innenseite deiner Oberschenkel. Bei Frauen sammeln sich die
          meisten Naschereien hier an.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Abduktor"
          :dark="$store.getters.darkmode"
        >
          sind die äußeren seitlichen Bauch- und Beinmuskeln.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Beinbeuger"
          :dark="$store.getters.darkmode"
        >
          wichtig für den hinteren Teil der Oberschenkel. Wir empfehlen das
          Training mit Beinbeuger besonders den Frauen, die Cellulite am
          Oberschenkel und Po bekämpfen wollen.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Gluteus Maximus"
          :dark="$store.getters.darkmode"
        >
          einfach gesagt dein Gesäßmuskel. Wichtiges Trainingsziel für alle, die
          einen knackigen Po haben wollen…oder alle die nicht mehr in die
          Lieblingsjeans passen.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Unterer Rücken (Rückenstrecker)"
          :dark="$store.getters.darkmode"
        >
          besonders wichtig bei Menschen, die sich berufsbedingt wenig bewegen
          und demnach unter Rückenschmerzen leiden. Durch gezieltes Training des
          unteren Rückens wird die Muskulatur gestärkt und so Schmerzen
          vorgebeugt.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Rumpf"
          :dark="$store.getters.darkmode"
        >
          umfasst den Brustkorb, Bauch, Rücken und Becken und seine schmalste
          Stelle ist die Taille. Das Training stärkt die Körpermitte und beugt
          Rückenbeschwerden vor.
        </tc-card>
        <tc-card
          :rounded="true"
          :shadow="false"
          title="Quadrizeps"
          :dark="$store.getters.darkmode"
        >
          befindet sich auf der Vorderseite des Oberschenkels.
        </tc-card>
      </masonry>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class MuscleGuide extends Vue {}
</script>

<style lang="scss" scoped>
.view-muscle-guide {
  .tc-card {
    margin-bottom: 20px;
  }
}
</style>
