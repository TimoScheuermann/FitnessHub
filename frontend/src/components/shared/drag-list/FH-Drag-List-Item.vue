<template>
  <div class="fh-drag-list-wrapper">
    <div
      class="fh-drag-list-item"
      :draggable="true"
      @dragstart.stop="dragStart"
      @click="handleClick"
    >
      <div class="fh-drag-list-item--avatar">
        <img src="" alt="" />
      </div>
      <div class="fh-drag-list-item--container">
        <div class="fh-drag-list-item--title">
          <slot />
        </div>
        <div class="fh-drag-list-item--description">
          <i class="ti-align-justify"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

interface FHRoute {
  name: string;
}

@Component
export default class FHDragListItem extends Vue {
  @Prop() img!: string;
  @Prop() index!: number;
  @Prop() to!: FHRoute;
  @Prop() href!: string;
  @Prop() routeName!: string;

  public dragStart(event: DragEvent) {
    const transfer = event.dataTransfer;
    if (transfer) {
      transfer.setData('comp-id', this.index + '');
      // this.$store.commit('setDrag', this.index);
    }
  }

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
.fh-drag-list-wrapper {
  position: relative;
  &:not(:last-child) {
    .fh-drag-list-item--container {
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

  .fh-drag-list-item {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: $size 1fr;
    grid-template-rows: minmax($size, 100%);
    border-radius: $border-radius;
    transition: background 0.2s ease-in-out, transform 0.5s;
    cursor: pointer;

    &:hover {
      background: rgba(darken($paragraph, 15%), 0.5);

      @media (prefers-color-scheme: dark) {
        background: rgba(lighten($paragraph_dark, 20%), 0.5);
      }
    }

    .fh-drag-list-item--avatar {
      display: grid;
      place-content: center;
      .tc-avatar {
        height: 30px;
        width: 30px;
      }
    }
    .fh-drag-list-item--container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;

      .fh-drag-list-item--description {
        padding-right: 10px;
      }
    }
  }
}
</style>
