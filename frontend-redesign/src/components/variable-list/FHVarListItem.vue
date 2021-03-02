<template>
  <router-link v-if="route" class="fh-var-list-item" transition :to="route">
    <span>{{ title }}</span>
    <slot />
  </router-link>
  <span v-else class="fh-var-list-item" transition>
    <span>{{ title }}</span>
    <slot />
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Location } from 'vue-router';

@Component
export default class FHVarListItem extends Vue {
  @Prop() title!: string;
  @Prop() routeName!: string;
  @Prop() to!: Location;

  get route(): Location | null {
    const to = this.to;
    if (this.routeName && !to) {
      this.to = { name: this.routeName };
    }
    return to || null;
  }
}
</script>

<style lang="scss" scoped>
.fh-var-list-item {
  padding: 5px 10px;
  margin: 0 5px 10px;
  border-radius: $border-radius;
  flex-grow: 1;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  background: $container;
  color: rgba($color, 0.75);
  @media #{$isDark} {
    background: $container_dark;
    color: rgba($color_dark, 0.75);
  }

  &:hover {
    color: rgba($color, 0.75);
    @media #{$isDark} {
      color: rgba($color_dark, 1);
    }
    transform: scale(1.0174);
  }
}
</style>
