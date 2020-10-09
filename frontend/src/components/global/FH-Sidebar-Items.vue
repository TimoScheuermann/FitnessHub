<template>
  <div class="fh-sidebar-items">
    <tc-sidebar-item routeName="home" icon="house" name="Home" />
    <tc-sidebar-item routeName="community" icon="users" name="Feed" />
    <tc-sidebar-group name="Training">
      <tc-sidebar-item routeName="training" icon="gym" name="Übersicht" />
      <!-- <tc-sidebar-item icon="chart-stocks" name="Beliebte Übungen" />
      <tc-sidebar-item icon="calendar-alt" name="Neueste Übungen" /> -->
      <tc-sidebar-item
        routeName="training-wiki"
        icon="books"
        name="Muskelguide"
      />
    </tc-sidebar-group>

    <tc-sidebar-group name="Ernährung">
      <tc-sidebar-item
        routeName="nutrition"
        icon="apple-alt"
        name="Übersicht"
      />
      <!-- <tc-sidebar-item icon="heart" name="Beliebte Rezepte" />
      <tc-sidebar-item icon="book-cook" name="Neueste Rezepte" /> -->
      <tc-sidebar-item
        icon="lightbulb"
        name="Ernährungstipps"
        routeName="nutrition-wiki"
      />
    </tc-sidebar-group>
    <tc-divider :dark="true" />
    <tc-badge
      v-if="$store.getters.valid"
      :value="$store.getters.totalNotifications"
      position="inside"
    >
      <tc-sidebar-item routeName="profile" icon="user" name="Profil" />
    </tc-badge>
    <tc-sidebar-item v-else icon="login" name="Anmelden" routeName="login" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHSidebarItems extends Vue {}
</script>
