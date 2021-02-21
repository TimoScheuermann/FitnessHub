<template>
  <div class="view-profile" content>
    <div max-width>
      <tc-list :dark="$store.getters.darkmode">
        <tc-list-item
          title="Einstellungen"
          icon="wrench"
          routeName="settings"
        />
        <!-- <tc-list-item icon="telegram" title="Telegram" routeName="telegram" /> -->
        <tc-badge :value="$store.getters.unreadMessages" position="inside">
          <tc-list-item
            title="Nachrichten"
            icon="chat-bubbles"
            routeName="messages"
          />
        </tc-badge>
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
        <tc-list-item
          title="Trainingsstatistik"
          icon="chart-bar"
          routeName="highlights"
        />
      </tc-list>

      <tc-list :dark="$store.getters.darkmode">
        <tc-list-item
          title="Meine Rezepte"
          icon="book-cook-filled"
          routeName="recipes"
        />
        <tc-list-item
          title="Workouts & Trainingsplan"
          icon="heartbeat"
          routeName="workouts"
        />
        <tc-list-item title="Übungen" icon="gym" routeName="exercises" />
        <tc-list-item title="Erfolge" icon="star" routeName="achievements" />
        <tc-list-item
          title="Herausforderungen"
          icon="trophy"
          description="bald"
        />
      </tc-list>

      <div v-group.admin.moderator>
        <h3>Management</h3>
        <tc-list :dark="$store.getters.darkmode">
          <tc-badge
            :value="($store.getters.exerciseSubmissions || []).length"
            position="inside"
          >
            <tc-list-item
              title="Eingereichte Übungen"
              icon="reply"
              routeName="submittedExercises"
            />
          </tc-badge>
          <tc-list-item
            title="Statistik"
            icon="chart-bar"
            routeName="statistics"
          />
          <tc-list-item title="Variablen" icon="gears" routeName="variables" />
          <tc-list-item
            v-group.admin
            title="Suspend User"
            icon="blocked"
            routeName="suspendUser"
          />
          <tc-list-item
            v-group.admin
            title="Promote User"
            icon="user-shield-filled"
            routeName="promoteUser"
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
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Profile extends Vue {
  public copyID(): void {
    copyToClipboard(this.$store.getters.user._id);
  }

  public signout(): void {
    signOut();
  }
}
</script>

<style lang="scss" scoped>
.view-profile {
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
