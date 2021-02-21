<template>
  <div
    class="fh-list-item"
    transition
    :cursor="to || routeName"
    @click="handleClick"
  >
    <tl-flow>
      <tc-avatar :src="avatar" size="tiny" v-if="avatar" />
    </tl-flow>
    <tl-flow class="content">
      <tl-flow flow="column" vertical="start">
        <div class="title">{{ title }}</div>
        <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
      </tl-flow>
      <tl-flow>
        <div class="description" v-if="description">{{ description }}</div>
        <slot />
      </tl-flow>
    </tl-flow>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Location } from 'vue-router';

@Component
export default class FHListItem extends Vue {
  @Prop() avatar!: string;
  @Prop() title!: string;
  @Prop() subtitle!: string;
  @Prop() description!: string;
  @Prop() routeName!: string;
  @Prop() to!: Location;

  public handleClick(e: MouseEvent) {
    this.$emit('click', e);
    const to = this.to;
    if (this.routeName && !to) {
      this.to = { name: this.routeName };
    }
    if (to) {
      this.$router.push(to);
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-list-item {
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-gap: 10px;
  border-radius: $border-radius;
  padding: 2.5px;
  min-height: 50px;
  padding-right: 10px;

  &:hover {
    background: rgba(darken($paragraph, 20%), 0.5);
    @media #{$isDark} {
      background: rgba(lighten($paragraph_dark, 20%), 0.5);
    }
  }
  .tc-avatar {
    transform: scale(0.8);
  }
  &:not(:last-child) .content::after {
    position: absolute;
    content: '';
    z-index: 10;
    bottom: -3.5px;
    right: -10px;
    left: 0;
    height: 1px;
    background: currentColor;
    opacity: 0.2;
  }

  .content {
    position: relative;
    flex-wrap: nowrap;
    .tl-flow {
      &:first-child {
        flex-grow: 1;
      }
      &:nth-child(2) {
        margin-left: 5px;
      }
    }
    .title {
      font-weight: 600;
    }
    .subtitle {
      margin-top: 2px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      opacity: 0.75;
      font-size: 15px;
    }
    .description {
      font-style: italic;
    }
  }
}
</style>
