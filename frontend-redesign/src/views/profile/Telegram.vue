<template>
  <div class="view-telegram" content>
    <div max-width>
      <FHAppear>
        <div v-if="$store.getters.telegramChat">
          <h3>Telegram</h3>
          <p>
            Du hast deinen Account erfolgreich mit Telegram verknüpft. Du kannst
            diese Verknüpfung jederzeit aufheben.
          </p>
          <br />
          <tc-button
            tfbackground="error"
            name="Verknüpfung löschen"
            @click="removeConnection"
          />
        </div>
        <div v-else>
          <div center>
            Verknüpfe deinen Telegram Account mit deinem FitnessHub Account, um
            alle Features der FitnessHub zu verwenden. Erhalte offline
            Nachrichten von Freunden und vieles mehr!
          </div>
          <br />
          <h3 center>Accounts verknüpfen</h3>
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
          <div class="token-input">
            <input
              placeholder="0"
              @paste="pasted"
              @input="input(0)"
              type="number"
              inputmode="numeric"
              maxlength="1"
              min="1"
              max="9"
              v-model="token[0]"
              ref="t0"
            />
            <input
              placeholder="0"
              @paste="pasted"
              @input="input(1)"
              type="number"
              inputmode="numeric"
              maxlength="1"
              min="0"
              max="9"
              v-model="token[1]"
              ref="t1"
            />
            <input
              placeholder="0"
              @paste="pasted"
              @input="input(2)"
              type="number"
              inputmode="numeric"
              maxlength="1"
              min="0"
              max="9"
              v-model="token[2]"
              ref="t2"
            />
            <input
              placeholder="0"
              @paste="pasted"
              @input="input(3)"
              type="number"
              inputmode="numeric"
              maxlength="1"
              min="0"
              max="9"
              v-model="token[3]"
              ref="t3"
            />
            <input
              placeholder="0"
              @paste="pasted"
              @input="input(4)"
              type="number"
              inputmode="numeric"
              maxlength="1"
              min="0"
              max="9"
              v-model="token[4]"
              ref="t4"
            />
            <input
              placeholder="0"
              @paste="pasted"
              @input="input(5)"
              type="number"
              inputmode="numeric"
              maxlength="1"
              min="0"
              max="9"
              v-model="token[5]"
              ref="t5"
            />
          </div>
        </div>
      </FHAppear>
    </div>
  </div>
</template>

<script lang="ts">
import FHAppear from '@/components/FHAppear.vue';
import backend from '@/utils/backend';
import { NotificationManagement } from '@/utils/NotificationManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FHAppear
  }
})
export default class Telegram extends Vue {
  public token: (string | null)[] = [null, null, null, null, null, null];

  public submitCode(): void {
    if (this.token.some(x => !x)) return;
    const code = this.token.filter(x => !!x).join('');
    if (code.length !== 6) return;

    backend.post('tgbot', { code: code }).catch(err => {
      NotificationManagement.sendNotification('Telegram', err.message, {
        name: 'telegram'
      });
    });
  }

  public pasted(e: ClipboardEvent): void {
    e.preventDefault();
    // eslint-disable-next-line
    const data = e.clipboardData || (window as any).clipboardData;
    const pasted: string = data.getData('Text');
    const token = +(pasted.match(/\d/g) || []).join('');
    if (token >= 100000 && token <= 999999) {
      this.token = token.toString().split('');
      this.submitCode();
    }
  }

  public input(index: number) {
    this.token = this.token.map(x => {
      if (!x) return x;
      return x[x.length - 1];
    });

    if (index < 5) {
      (this.$refs['t' + (index + 1)] as HTMLInputElement).focus();
    } else if (index === 5) {
      this.submitCode();
    }
  }

  public removeConnection(): void {
    backend.delete('tgbot');
    this.$store.commit('telegramChat', null);
  }
}
</script>

<style lang="scss" scoped>
.view-telegram {
  h3 {
    margin-top: 0;
  }
  .token-input {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-gap: 10px;

    input {
      background: none;
      border: none;
      outline: none;
      color: inherit;
      font: inherit;
      text-align: center;
      -moz-appearance: textfield;

      &::placeholder {
        color: inherit;
        opacity: 0.25;
      }
      -webkit-appearance: none;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      font-weight: bold;
      font-size: 20px;

      background: $paragraph;
      @media #{$isDark} {
        background: $paragraph_dark;
      }
      border-radius: $border-radius;
      height: 50px;
    }
  }
}
</style>
