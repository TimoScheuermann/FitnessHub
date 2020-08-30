<template>
  <tc-avatar v-if="hasImage" :size="size" :src="user.avatar" />
  <div class="fh-avatar tc-avatar" :class="'fh-avatar__' + size" v-else>
    {{ text }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IUser, IUserInfo } from '../../utils/interfaces';
import store from '../../store';

@Component
export default class FHAvatar extends Vue {
  @Prop({ default: 'small' }) size!: string; // tiny, small, medium, large
  @Prop({
    default: () => {
      return store.getters.user;
    }
  })
  user!: IUser | IUserInfo | Record<string, unknown>;

  get hasImage(): boolean {
    return this.user && !!this.user.avatar;
  }

  get text() {
    let names: string[] = [];
    if (!this.user) return ':/';
    if ((this.user as Record<string, unknown>).username) {
      names.push(...(this.user as IUserInfo).username.split(' '));
    } else {
      names.push(
        (this.user as IUser).givenName,
        (this.user as IUser).familyName
      );
    }
    names = names.filter(x => x.length > 0);
    if (names.length >= 2) return names[0][0] + names[1][0];
    return names[0].substring(0, 2);
  }
}
</script>

<style lang="scss" scoped>
.fh-avatar,
.tc-avatar {
  box-shadow: $shadow-light;
}
.fh-avatar {
  height: 100px;
  width: 100px;
  border-radius: 100px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;

  $sizes: (
    large: 200px,
    medium: 150px,
    small: 100px,
    tiny: 50px
  );
  @each $n, $s in $sizes {
    &.fh-avatar__#{$n} {
      height: $s;
      width: $s;
      border-radius: $s;
      font-size: #{$s / 2.5};
    }
  }
  background-image: radial-gradient(
      circle at 46% 40%,
      rgba(228, 228, 228, 0.06) 0%,
      rgba(228, 228, 228, 0.06) 13%,
      transparent 13%,
      transparent 100%
    ),
    radial-gradient(
      circle at 11% 41%,
      rgba(198, 198, 198, 0.06) 0%,
      rgba(198, 198, 198, 0.06) 19%,
      transparent 19%,
      transparent 100%
    ),
    radial-gradient(
      circle at 52% 23%,
      rgba(14, 14, 14, 0.06) 0%,
      rgba(14, 14, 14, 0.06) 69%,
      transparent 69%,
      transparent 100%
    ),
    radial-gradient(
      circle at 13% 85%,
      rgba(148, 148, 148, 0.06) 0%,
      rgba(148, 148, 148, 0.06) 44%,
      transparent 44%,
      transparent 100%
    ),
    radial-gradient(
      circle at 57% 74%,
      rgba(232, 232, 232, 0.06) 0%,
      rgba(232, 232, 232, 0.06) 21%,
      transparent 21%,
      transparent 100%
    ),
    radial-gradient(
      circle at 59% 54%,
      rgba(39, 39, 39, 0.06) 0%,
      rgba(39, 39, 39, 0.06) 49%,
      transparent 49%,
      transparent 100%
    ),
    radial-gradient(
      circle at 98% 38%,
      rgba(157, 157, 157, 0.06) 0%,
      rgba(157, 157, 157, 0.06) 24%,
      transparent 24%,
      transparent 100%
    ),
    radial-gradient(
      circle at 8% 6%,
      rgba(60, 60, 60, 0.06) 0%,
      rgba(60, 60, 60, 0.06) 12%,
      transparent 12%,
      transparent 100%
    ),
    linear-gradient(90deg, $success, rgb(66, 201, 56));
}
</style>
