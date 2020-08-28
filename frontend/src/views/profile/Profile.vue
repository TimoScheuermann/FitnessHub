<template>
  <div class="profile">
    <tc-hero :hasFixedHeader="false" :height="200">
      <img
        src="https://images.unsplash.com/photo-1597075933405-a06cb4d6cecb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
        slot="background"
        alt=""
      />
      <tl-flow>
        <fp-avatar />
        <div class="info">
          <div class="name">{{ name }}</div>
          <div class="date">Mitglied seit: {{ date }}</div>
        </div>
      </tl-flow>
    </tc-hero>
    <div content>
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
        <tc-list-item title="Trainingspläne" icon="calendar-alt" />
        <tc-list-item title="Freunde" icon="users" routeName="friends" />
        <tc-list-item title="Workouts" icon="gym" />
        <tc-list-item title="Gesundheit" icon="heart" />
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
  get name(): string {
    const user = this.$store.getters.user;
    return [user.givenName, user.familyName].filter(x => !!x).join(' ');
  }

  get date(): string {
    const date: Date = new Date(this.$store.getters.user.date);
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
  }

  public signout(): void {
    signOut();
  }

  public copyID(): void {
    copyToClipboard(this.$store.getters.user._id);
  }
}
</script>

<style lang="scss" scoped>
.tc-hero {
  img {
    filter: brightness(60%);
  }
  .tl-flow {
    margin-top: env(safe-area-inset-top);
    .fp-avatar,
    .tc-avatar {
      transform: scale(0.8);
      margin: 5px;
    }
    .info {
      margin: 5px;
      color: #fff;
      .name {
        font-weight: 500;
        font-size: 1.2em;
      }
    }
  }
}
.tc-list {
  margin-bottom: 20px;
}
.footer {
  font-size: 12px;
  div {
    text-align: center;
    opacity: 0.5;
  }
}
</style>
