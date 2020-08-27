<template>
  <div class="profile">
    <tc-hero
      color="#fff"
      gradient="linear-gradient(90deg, rgb(243, 114, 209) 0%,rgb(44, 19, 241) 100%);"
    >
      <tl-flow flow="column">
        <fp-avatar />
        <h1>{{ name }}</h1>
      </tl-flow>
    </tc-hero>
    <div content>
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

  public signout() {
    signOut();
  }
}
</script>

<style lang="scss" scoped>
[content] {
  padding-top: 20px;
}
.tc-hero h1 {
  margin: 0;
  margin-top: 5px;
  text-align: center;
}
.tc-list {
  margin-bottom: 20px;
}
</style>
