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
        <tc-list-item title="Trainingspläne" icon="calendar-alt" />
        <tc-list-item title="Freunde" icon="users" routeName="friends" />
        <tc-list-item title="Workouts" icon="gym" />
        <tc-list-item title="Gesundheit" icon="heart" />
      </tc-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FPAvatar from '@/components/shared/FP-Avatar.vue';
import { signOut } from '@/utils/auth';

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

  public signout() {
    signOut();
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
</style>
