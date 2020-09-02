<template>
  <div class="settings" content>
    <h1>Allgemein</h1>
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item title="What ever" icon="lightbulb" :value="true" />
      <tc-list-item title="What ever" icon="lightbulb" :value="true" />
      <tc-list-item title="What ever" icon="lightbulb" :value="true" />
    </tc-list>
    <h1>Freunde</h1>
    <tc-list :dark="$store.getters.darkmode">
      <tc-list-item title="Anfragen erhalten" icon="reply" :value="true" />
      <tc-list-item
        title="Nachrichten erhalten"
        icon="chat-bubbles"
        :value="true"
      />
      <tc-list-item
        title="Gesundheitsdaten teilen"
        icon="heart"
        :value="true"
      />
    </tc-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {}
</script>

<style lang="scss" scoped></style>
