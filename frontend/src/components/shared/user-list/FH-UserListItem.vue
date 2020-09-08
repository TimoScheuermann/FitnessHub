<template>
  <div class="fh-user-list-item" @click="handleClick">
    <div class="fh-user-list-item--avatar">
      <fh-avatar :user="user" />
    </div>
    <div class="fh-user-list-item--container">
      <div class="fh-user-list-item--title">
        <slot />
      </div>
      <div class="fh-user-list-item--description">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IUser, IUserInfo } from '@/utils/interfaces';

interface FHRoute {
  name: string;
}

@Component
export default class FHUserListItem extends Vue {
  @Prop() to!: FHRoute;
  @Prop() href!: string;
  @Prop() routeName!: string;
  @Prop() user!: IUser | IUserInfo;

  public handleClick(e: MouseEvent) {
    this.$emit('click', e);
    this.open();
  }

  public open(target: '_blank' | undefined = undefined) {
    if (this.href) {
      window.open(this.href, target);
    } else {
      let route: FHRoute = this.to;
      if (!route && this.routeName) {
        route = { name: this.routeName };
      }
      if (route && this.$route.name !== route.name) {
        this.$router.push(route);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 40px;

.fh-user-list.dark .fh-user-list-item:hover {
  background: rgba(lighten($paragraph_dark, 20%), 0.5);
}
.fh-user-list-item {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: $size 1fr;
  grid-template-rows: minmax($size, 100%);
  border-radius: $border-radius;
  transition: background 0.2s ease-in-out, transform 0.5s;
  cursor: pointer;

  background: $paragraph;
  @media (prefers-color-scheme: dark) {
    background: $paragraph_dark;
  }

  &:hover {
    background: rgba(darken($paragraph, 15%), 0.5);
  }
  &:not(:last-child) {
    .fh-user-list-item--container {
      &::after {
        position: absolute;
        content: '';
        z-index: 10;
        bottom: 0;
        right: 0;
        left: 0;
        height: 1px;
        background: currentColor;
        opacity: 0.2;
      }
    }
  }

  .fh-user-list-item--avatar {
    display: grid;
    place-content: center;
    .tc-avatar {
      height: 30px;
      width: 30px;
    }
  }
  .fh-user-list-item--container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .fh-user-list-item--description {
      padding-right: 10px;
    }
  }
}
</style>
