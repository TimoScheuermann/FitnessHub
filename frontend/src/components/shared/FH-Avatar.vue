<template>
  <tc-avatar class="fh-avatar" :size="size" :src="src" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IUser, IUserInfo } from '@/utils/interfaces';
import store from '@/store';

@Component
export default class FHAvatar extends Vue {
  @Prop({ default: 'small' }) size!: string; // tiny, small, medium, large
  @Prop({
    default: () => {
      return store.getters.user;
    }
  })
  user!: IUser | IUserInfo | Record<string, unknown>;

  get src(): string {
    if (!this.user)
      return 'https://eu.ui-avatars.com/api/?name=:)&background=25ca49&color=fff&size=1000&bold=true&format=svg';
    if (this.user.avatar) return this.user.avatar as string;
    let name = ':)';
    if ((this.user as IUserInfo).username) {
      name = (this.user as IUserInfo).username;
    } else {
      name =
        (this.user as IUser).givenName + ' ' + (this.user as IUser).familyName;
    }
    return `https://eu.ui-avatars.com/api/?name=${encodeURI(
      name
    )}&background=25ca49&color=fff&size=1000&bold=true&format=svg`;
  }
}
</script>

<style lang="scss" scoped>
.tc-avatar {
  box-shadow: $shadow-light;
}
</style>
