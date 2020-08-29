<template>
  <div class="profile" content>
    <h1>Profil</h1>
    <tc-list tfcolor="error">
      <tc-list-item title="Abmelden" icon="logout" @click="signout" />
    </tc-list>
    <tc-list>
      <tc-list-item
        v-if="$store.getters.user.group !== 'User'"
        icon="shield"
        title="Gruppe"
        :description="$store.getters.user.group"
      />
      <tc-badge :value="$store.state.notifications.inbox" position="inside">
        <tc-list-item title="Inbox" icon="notification" routeName="inbox" />
      </tc-badge>
      <tc-badge :value="$store.state.notifications.friends" position="inside">
        <tc-list-item title="Freunde" icon="users" routeName="friends" />
      </tc-badge>
      <tc-list-item title="Gesundheit" icon="heart" routeName="health" />
    </tc-list>

    <tc-list>
      <tc-list-item title="Trainingspläne" icon="calendar-alt" />
      <tc-list-item title="Workouts" icon="list" />
      <tc-list-item title="Übungen" icon="gym" />
    </tc-list>

    <!-- Profil Ende -->

    <div v-group.admin.moderator>
      <h1>Management</h1>
      <tc-list>
        <tc-list-item
          title="Eingereichte Übungen"
          icon="reply"
          routeName="submittedExercises"
        />
        <tc-list-item
          title="Statistik"
          icon="chart-bar"
          routeName="statistics"
        />
        <tc-list-item
          v-group.admin
          title="Promote User"
          icon="user-shield"
          routeName="promoteUser"
        />
      </tc-list>
    </div>
    <!-- Management Ende -->

    <div class="footer" @click="copyID">
      <div>User ID</div>
      <div>{{ $store.getters.user._id }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FPAvatar from '@/components/shared/FP-Avatar.vue';
import { signOut } from '@/utils/auth';
import { copyToClipboard } from '@/utils/functions';

@Component({
  components: {
    'fp-avatar': FPAvatar
  }
})
export default class Profile extends Vue {
  public signout(): void {
    signOut();
  }

  public copyID(): void {
    copyToClipboard(this.$store.getters.user._id);
  }
}
</script>

<style lang="scss" scoped>
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
</style>
