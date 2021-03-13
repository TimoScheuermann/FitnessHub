<template>
  <div class="view-Telegram" content>
    <div max-width>
      <FHAppear>
        <div v-if="$store.getters.telegramChat">
          <h1>Ya</h1>
          <p>{{ $store.getters.telegramChat }}</p>

          <tc-button
            tfbackground="error"
            name="Verknüpfung löschen"
            @click="removeConnection"
          />
        </div>
        <div v-else>
          <h1 center>FitnessHub x <i class="ti-telegram"></i></h1>
          <p center>
            Verknüpfe deinen Telegram Account mit deinem FitnessHub Account, um
            alle Features der FitnessHub zu verwenden. Erhalte offline
            Nachrichten von Freunden und vieles mehr!
          </p>
          <br />
          <h3>Accounts verknüpfen</h3>
          <ol>
            <li>Telegram installieren</li>
            <li>
              Unserem Bot eine beliebige
              <tc-link href="http://t.me/FitnessHubAppBot" tfcolor="success">
                Nachricht senden
              </tc-link>
            </li>
            <li>
              Auf seine Antwort warten und den erhaltenen Code unten eingeben
            </li>
          </ol>

          <br />
          <tl-flow vertical="end">
            <tc-input
              icon="telegram"
              title="Code eingeben"
              :dark="$store.getters.darkmode"
              v-model="code"
            />
            <tc-button
              name="Bestätigen"
              tfbackground="success"
              variant="filled"
              @click="submitCode"
            />
          </tl-flow>
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import backend from '@/utils/backend';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear
  }
})
export default class Telegram extends Vue {
  public code = '';

  public submitCode(code: string = this.code): void {
    backend.post('tgbot/code', { code: code });
  }

  public removeConnection(): void {
    backend.delete('tgbot');
    this.$store.commit('telegramChat', null);
  }
}
</script>

<style lang="scss" scoped></style>
