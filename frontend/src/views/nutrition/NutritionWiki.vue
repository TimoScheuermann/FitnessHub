<template>
  <div class="nutrition-wiki" content>
    <h1>Wiki</h1>

    <h2>Nährstoffe</h2>

    <tl-grid>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Ballaststoffe"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Senken von Cholesterinspiegel</li>
            <li>Regulierung von Blutzucker</li>
            <li>Förderung der Darmbewegung</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>Äpfel</li>
            <li>Birnen</li>
            <li>Beeren</li>
            <li>Zitrusfrüchte</li>
            <li>getrocknete Aprikosen/Pflaumen/Rosinen</li>
            <li>Vollkorn</li>
            <li>Brokkoli</li>
            <li>Erbsen</li>
            <li>Karotten</li>
            <li>Kohl</li>
            <li>Nüsse und Samen</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Calcium"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Haare, Zähne, Knochen</li>
            <li>Muskeln</li>
            <li>Nerven</li>
            <li>Blutgerinnung</li>
            <li>Entzündungen</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>Milch</li>
            <li>grünem Gemüse (Fenchel, Brokkoli, Grünkohl, ...)</li>
            <li>Beeren</li>
            <li>Kräuter</li>
            <li>Nüsse</li>
            <li>Vollkorn</li>
            <li>Eier</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Fette/Lipide"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <ul>
            <li>
              bringen mehr als das Doppelte an Energie wie Proteine oder
              Kohlenhydrate
            </li>
            <li>gesättigte Fettsäuren: Fleisch, Butter, ...</li>
            <li>ungesättigte Fettsäuren: Pflanzenöle, Fisch, ...</li>
            <li>Trans-Fettsäure: Chips, ... --> SCHLECHT</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Kohlenhydrate"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <ul>
            <li>
              komplexe Kohlenhydrate: Getreide, Vollkorn, Kartoffeln, ... -->
              Zucker muss erst aufgespalten werden
            </li>
            <li>Einfach Zucker: Frucht- und Traubenzucker</li>
            <li>Zweifachzucker: Haushalts- und Milchzucker</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Magnesium"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Muskeln</li>
            <li>Nerven</li>
            <li>Herz</li>
            <li>Knochen, Zähne</li>
            <li>Energiestoffwechsel</li>
            <li>Elektrolytgleichgewicht</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>Vollkorn</li>
            <li>Hafer</li>
            <li>grünes Gemüse</li>
            <li>Nüsse</li>
            <li>Samen, Kerne</li>
            <li>Hülsenfrüchte</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Makronährstoffe"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>was ist das?:</h3>
          <ul>
            <li>Energielieferanten</li>
            <li>Kohlenhydrate, Proteine, Fette</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Mikronährstoffe"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>was ist das?:</h3>
          <ul>
            <li>Depots in Knochen, Zähne, Haut, Leber und Muskulatur</li>
            <li>Vitamine, Mineralstoffe, Spurenelemente</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Omega 3"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Entzüdungshemmend</li>
            <li>Fließeigenschaft von Blut</li>
            <li>Blutdruck senkend</li>
            <li>Aufbau von Zellen</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>Fisch (Lachs, Thunfisch, Forelle, Sardine, Makrele,..)</li>
            <li>Raps-, Hanf-, Lein-, Walnuss-, Chiaöl</li>
            <li>Rosenkohl</li>
            <li>Avocado</li>
            <li>Spinat</li>
            <li>Bohnen</li>
            <li>Nüsse</li>
            <li>Samen</li>
            <li>Soja</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Präbiotika"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Darmflora</li>
            <li>Immunsystem</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>Spargel</li>
            <li>Getreide</li>
            <li>Chicorée</li>
            <li>Topinambur</li>
            <li>Zwiebeln</li>
            <li>Knoblauch</li>
            <li>Schwarzwurzel</li>
            <li>grüne Bananen</li>
            <li>Bohnen</li>
            <li>Erbsen</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Probiotika"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Darmflora</li>
            <li>Immunsystem</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>Joghurt</li>
            <li>Käse</li>
            <li>Sauerkraut</li>
            <li>Sauerteig</li>
            <li>Kefir</li>
            <li>Miso</li>
            <li>Kombucha</li>
            <li>Tempeh</li>
            <li>Buttermilch</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Proteine/Eiweiß"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <ul>
            <li>werden nicht lange vom Körper gespeichert</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Vitamin B7 (Biotin)"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Haut, Haare, Nägel</li>
            <li>Stoffwechsel</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>Eier</li>
            <li>Nüsse</li>
            <li>Haferflocken</li>
            <li>Milch</li>
            <li>Hefe</li>
            <li>Leber</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Vitamin B12"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>wichtig für:</h3>
          <ul>
            <li>Stoffwechel</li>
            <li>Abbau von Fettsäuren</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>
              nur in tierischen Nahrungsmitteln, da es nur von Mikroorganismen
              synthetisiert werden kann
            </li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Vitamin C"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Immunsystem</li>
            <li>Bindegewebe</li>
            <li>Botenstoffe</li>
            <li>Eisenaufnahme</li>
            <li>Zellen</li>
            <li>Haut, Zähne, Knochen</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>Hagebutte</li>
            <li>Sanddorn</li>
            <li>Paprika</li>
            <li>Kohl</li>
            <li>Zitrusfrüchte</li>
            <li>Beeren</li>
            <li>Spinat</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Vitamin D3"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Kalziumaufnahme</li>
            <li>Erhalt und Aufbau von Knochen</li>
            <li>Zellstoffwechsel</li>
            <li>Aufnahme über Sonnenlicht über die Haut!</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>
              kaum in Nahrung, jedoch: fetthaltiger Fisch (Lachs, Aal, Makrele,
              Hering, ...)
            </li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Vitamin K2"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <h3>gut für:</h3>
          <ul>
            <li>Einlagerung von Calcium in Knochen</li>
            <li>-> Beugt Arteriosklerose (Arterienverkalkung) vor</li>
            <li>-> Beugt Osteoporose (brüchige Knochen) vor</li>
          </ul>
          <h3>enthalten in:</h3>
          <ul>
            <li>Kräuter (Kresse, Schnittlauch)</li>
            <li>grünes Blattgemüse</li>
            <li>Rinderleber</li>
            <li>Sojabohnen</li>
            <li>Hafer</li>
            <li>Vollweizen</li>
            <li>Kartoffeln</li>
            <li>Kohl</li>
          </ul>
        </div>
      </tc-card>
    </tl-grid>

    <h2>Supplements:</h2>

    <tl-grid>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Whey"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <ul>
            <li>aus Molkenprotein der Milch (natürliches Eiweiß)</li>
            <li>leicht verdaulich, kurze Resorptionszeit</li>
            <li>enthält alle unentbährlichen Aminosöuren</li>
            <li>Whey-Konzentrat:</li>
            <ul>
              <li>hoher Eiweißgehalt (70-78%), günstig</li>
            </ul>
            <li>Whey-Isolat</li>
            <ul>
              <li>
                hoher Eiweißgehalt (90-96%), geringer Fett- und
                Kohlenhydrat-Anteil, laktosefrei
              </li>
            </ul>
            <li>Whey-Hydrolysat</li>
            <ul>
              <li>
                aus Whey-Konzentrat oder -Isolat gewonnen, aufgespaltete
                Proteine für eine bessere Aufnahme
              </li>
            </ul>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Casein"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <ul>
            <li>Milchprotein</li>
            <li>wird langsamer aufgenommen (eignet sich für Abends!)</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="Kreatin"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <ul>
            <li>
              Wassereinlagerungen in den Muskeln - lassen diese praller und
              größer aussehen
            </li>
            <li>mehr Kraft und Kraftausdauer</li>
            <li>weniger Muskelschäden</li>
            <li>verkürzte Regenerationszeit</li>
            <li>
              Achtung: Achte darauf zusätzlich genug Flüssigkeit zu dir zu
              nehmen!
            </li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="L-Glutamin"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <ul>
            <li>Beschleunigung der Regenaration</li>
            <li>schnellere Wiederauffüllung der Glykogen-Speicher</li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="EAAs"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <ul>
            <li>
              essentielle Aminosäuren sich wichtg für das Immunsystem und den
              Stoffwechsel
            </li>
            <li>können nicht vom Körper hergestellt werden</li>
            <li>
              sind am Aufbau von Proteinen und somit an anabolen Prozessen
              beteiligt
            </li>
            <li>
              werden nicht genügend EAAs zugeführt, nimmt sich der Organismus
              dieses aus der eigenen Körpersubstanz
            </li>
          </ul>
        </div>
      </tc-card>
      <tc-card
        :rounded="true"
        :shadow="false"
        title="BCAAs"
        :dark="$store.getters.darkmode"
      >
        <div class="card-content">
          <ul>
            <li>essentiellen Aminosäuren Valin, Leucin, Isoleucin</li>
            <li>
              werden nicht über die Leber verstoffwechselt, sondern direkt über
              den Darm aufgenommen
            </li>
            <li>wichtig für die Muskelproteisynthese</li>
          </ul>
        </div>
      </tc-card>
    </tl-grid>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class NutritionWiki extends Vue {}
</script>

<style lang="scss" scoped>
.nutrition-wiki {
  .card-content {
    text-align: justify;
  }
}
</style>
