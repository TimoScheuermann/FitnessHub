<template>
  <div class="interim-profile">
    <tc-hero
      :dark="$store.getters.darkmode"
      :hasFixedHeader="$store.getters.isDesktop"
    >
      <img src="assets/hero/profile.webp" slot="background" alt="" />

      <tl-flow v-if="$route.name === 'profile'" class="user-avatar">
        <tc-avatar :src="$store.getters.user.avatar" />
        <div class="info">
          <div class="name">{{ $store.getters.name }}</div>
          <div>Mitglied seit: {{ since }}</div>
        </div>
      </tl-flow>
      <h1 v-else center>{{ $route.meta.hero }}</h1>
    </tc-hero>
    <FHRouter />
  </div>
</template>

<script lang="ts">
import FHRouter from '@/components/FHRouter.vue';
import { IUser } from '@/utils/interfaces';
import { Vue, Component } from 'vue-property-decorator';
@Component({
  components: {
    FHRouter
  }
})
export default class InterimProfile extends Vue {
  get since(): string {
    const user: IUser | null = this.$store.getters.user;
    if (!user) return '';
    const date = new Date(user.date);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }
}
</script>

<style lang="scss" scoped>
.interim-profile {
  img[src='assets/hero/profile.webp'] {
    filter: brightness(80%);
  }

  .user-avatar {
    .tc-avatar {
      transform: scale(0.8);
      margin: 5px;
    }
    .info {
      margin: 5px;
      .name {
        font-weight: bold;
        font-size: 1.2em;
      }
    }
  }
}
</style>
