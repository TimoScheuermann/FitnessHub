<template>
  <div class="settings" content>
    <tl-grid gap="0px 20">
      <div>
        <h1>Allgemein</h1>
        <tc-list :dark="$store.getters.darkmode">
          <tc-list-item title="Sprache" icon="book" description="Deutsch" />
          <tc-list-item
            title="Angemeldet mit"
            icon="at"
            :description="$store.getters.user.provider"
          />
          <tc-list-item
            title="Profil bearbeiten"
            icon="pencil"
            :href="profileEditUrl"
          />
        </tc-list>
      </div>
      <div>
        <h1>Freunde</h1>
        <tc-list :dark="$store.getters.darkmode">
          <tc-list-item title="Anfragen erhalten" icon="reply" :value="true" />
          <tc-list-item
            title="Nachrichten erhalten"
            icon="chat-bubbles"
            :value="true"
          />
          <tc-list-item
            title="Challenges erhalten"
            icon="ghost"
            :value="true"
          />
          <tc-list-item title="Gewicht teilen" icon="barometer" :value="true" />
          <tc-list-item title="Trinkometer" icon="bucket" :value="true" />
          <tc-list-item title="Größe teilen" icon="arrows-v" :value="true" />
        </tc-list>
      </div>
    </tl-grid>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {
  get profileEditUrl(): string {
    switch (this.$store.getters.user.provider) {
      case 'amazon':
        return 'https://www.amazon.com/gp/pdp/profile/';
      case 'adobe':
        return 'https://account.adobe.com/profile';
      case 'github':
        return 'https://github.com/settings/profile';
      case 'steam':
        return 'https://steamcommunity.com/my/edit';
      default:
        return 'https://myaccount.google.com/personal-info';
    }
  }
}
</script>

<style lang="scss" scoped></style>
