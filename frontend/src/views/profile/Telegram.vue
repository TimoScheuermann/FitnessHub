<template>
  <div class="telegram" content>
    <template v-if="$store.state.telegramChat">
      Verknüpft! {{ $store.state.telegramChat }}
    </template>
    <template v-else>
      <h1>Vorteile einer Verknüpfung</h1>
      <p>
        Verknüpfe deinen Telegram Account mit deinem FitnessHub Account, um alle
        Features der FitnessHub zu verwenden. Hierunter fallen Funktionen wie:
      </p>
      <ul>
        <li>A</li>
        <li>A</li>
        <li>A</li>
      </ul>

      <h1>Accounts verknüpfen</h1>
      <p>Durch diese einfachen Schritte kannst du deinen Account verknüpfen</p>
      <div class="steps">
        <div class="step">
          <div class="number">1</div>
          <div class="description">Telegram installieren</div>
        </div>
        <div class="step">
          <div class="number">2</div>
          <div class="description">
            Unserem Bot eine beliebige
            <tc-link href="http://t.me/FitnessHubAppBot" tfcolor="success"
              >Nachricht senden</tc-link
            >
          </div>
        </div>
        <div class="step">
          <div class="number">3</div>
          <div class="description">
            Auf seine Antwort warten und den erhaltenen Code unten eintragen
          </div>
        </div>
      </div>
      <h2>Code eingeben</h2>
      <div class="code-grid">
        <tc-input
          icon="terminal"
          v-model="code"
          :dark="$store.getters.darkmode"
        />
        <tc-button
          name="Bestätigen"
          tfbackground="success"
          variant="filled"
          @click="submitCode()"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Telegram extends Vue {
  public code = '';

  public submitCode(code: string = this.code): void {
    axios.post('tgbot/code', { code: code });
  }
}
</script>

<style lang="scss" scoped>
.telegram {
  .code-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .steps {
    .step {
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: 40px 1fr;
      .number {
        font-size: 2em;
        font-weight: 900;
      }
      .description {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .tc-link {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
