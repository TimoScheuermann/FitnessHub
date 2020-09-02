<template>
  <div class="settings" content>
    <h1>Allgemein</h1>
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item title="Sprache" icon="book" description="Deutsch" />
      <tc-list-item title="Dunkler Modus" icon="lightbulb" :value="true" />
      <fh-user-list-item :user="{ username: '  ' }">
        Primär Farbe
        <tc-input
          slot="action"
          :dark="$store.getters.darkmode"
          type="color"
          v-model="$store.state.primaryColor"
        />
      </fh-user-list-item>
    </tc-list>
    <h1>Freunde</h1>
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item title="Anfragen erhalten" icon="reply" :value="true" />
      <tc-list-item
        title="Nachrichten erhalten"
        icon="chat-bubbles"
        :value="true"
      />
      <tc-list-item title="Challenges erhalten" icon="ghost" :value="true" />
    </tc-list>

    <em><br /></em>
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item title="Gewicht teilen" icon="barometer" :value="true" />
      <tc-list-item title="Größe teilen" icon="arrows-v" :value="true" />
    </tc-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {}
</script>

<style lang="scss" scoped></style>
