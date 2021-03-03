<template>
  <div class="view-profile" content>
    <div max-width>
      <h4>Social</h4>
      <tc-list :dark="$store.getters.darkmode">
        <!-- <tc-list-item icon="telegram" title="Telegram" routeName="telegram" /> -->
        <tc-badge
          :value="$store.getters.unansweredFriendRequests"
          position="inside"
        >
          <tc-list-item
            title="Freunde"
            icon="users-filled"
            routeName="friends"
          />
        </tc-badge>
        <tc-badge :value="unreadMessages" tfcolor="success" position="inside">
          <tc-list-item
            title="Nachrichten"
            icon="chat-bubbles"
            routeName="messages"
          />
        </tc-badge>
        <tc-list-item
          title="Herausforderungen"
          icon="trophy"
          description="bald"
        />
      </tc-list>

      <h4>Management</h4>
      <tc-list :dark="$store.getters.darkmode">
        <tc-list-item
          title="Rezepte"
          icon="book-cook-filled"
          routeName="recipes"
        />
        <tc-list-item title="Übungen" icon="gym" routeName="exercises" />
        <tc-list-item title="Workouts" icon="heartbeat" routeName="workouts" />
        <tc-list-item
          title="Einstellungen"
          icon="wrench"
          routeName="settings"
        />
      </tc-list>

      <h4>Training</h4>
      <tc-list :dark="$store.getters.darkmode">
        <tc-list-item
          title="Trainingsplan"
          icon="list"
          routeName="trainingplan"
        />

        <tc-list-item
          title="Trainingsstatistik"
          icon="chart-bar"
          routeName="statistics"
        />
        <tc-list-item title="Erfolge" icon="star" routeName="achievements" />
      </tc-list>

      <div v-group.admin.moderator>
        <h4>Admin panel</h4>
        <tc-list :dark="$store.getters.darkmode">
          <tc-badge :value="submissions" tfcolor="success" position="inside">
            <tc-list-item
              title="Eingereichte Übungen"
              icon="reply"
              routeName="exercise-submissions"
            />
          </tc-badge>
          <tc-list-item
            title="Statistik"
            icon="chart-bar"
            routeName="mgmt-statistics"
          />
          <tc-list-item
            title="Variablen"
            icon="gears"
            routeName="mgmt-variables"
          />
          <tc-list-item
            title="Nutzer sperren"
            icon="blocked"
            routeName="mgmt-suspend-user"
          />
          <tc-list-item
            v-group.admin
            title="Nutzer befördern"
            icon="user-shield-filled"
            routeName="mgmt-promote-user"
          />
        </tc-list>
      </div>

      <tc-list :dark="$store.getters.darkmode">
        <tc-list-item error icon="logout" title="Abmelden" @click="signout" />
      </tc-list>

      <div class="footer" @click="copyID">
        <div>User ID</div>
        <div>{{ $store.getters.user._id }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { signOut } from '@/utils/auth';
import { copyToClipboard } from '@/utils/functions';
import { NotificationManagement } from '@/utils/NotificationManagement';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Profile extends Vue {
  public copyID(): void {
    copyToClipboard(this.$store.getters.user._id);
  }

  public signout(): void {
    signOut();
  }

  get unreadMessages(): number {
    return NotificationManagement.getUnreadMessages();
  }

  get submissions(): number {
    return NotificationManagement.getExerciseSubmissions();
  }
}
</script>

<style lang="scss" scoped>
.view-profile {
  h4 {
    margin-bottom: 4px;
    margin-left: 5px;
    opacity: 0.75;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .tc-list {
    margin-bottom: 20px;
    .tc-badge:after {
      position: absolute;
      content: '';
      z-index: 10;
      bottom: 0;
      right: 0;
      left: 50px;
      height: 1px;
      background: currentColor;
      opacity: 0.2;
    }
  }
  .footer {
    font-size: 12px;
    div {
      text-align: center;
      opacity: 0.5;
    }
  }
}
</style>
