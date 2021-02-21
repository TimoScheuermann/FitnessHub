<template>
  <div
    class="fh-button"
    :class="{ 'fh-button__frosted': frosted }"
    cursor
    transition
    @click="handleClick"
  >
    <i v-if="icon" :class="'ti-' + icon" />
    <span v-if="title">{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Location } from 'vue-router';

@Component
export default class FHButton extends Vue {
  @Prop() icon!: string;
  @Prop() title!: string;
  @Prop() to!: Location;
  @Prop() routeName!: string;
  @Prop() frosted!: boolean;

  public handleClick(e: Event): void {
    if (this.to && this.to.name) {
      this.navigate(this.to);
    } else if (this.routeName) {
      this.navigate({ name: this.routeName });
    }
    this.$emit('click', e);
  }

  private navigate(to: Location): void {
    if (this.$route.name !== to.name) {
      this.$router.push(to);
    }
  }
}
</script>

<style lang="scss" scoped>
.fh-button {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 10px;
  border-radius: $border-radius;

  background: $container;
  &__frosted {
    @include backdrop-blur($container);
  }
  @media #{$isDark} {
    background: $container_dark;
    &__frosted {
      @include backdrop-blur($container_dark);
    }
  }

  &:hover,
  &:active {
    transform: scale(1.0174);
    box-shadow: 1px 2px 3px rgba(#111, 0.12);
  }

  i,
  span {
    margin: 0 5px;
  }
  span {
    font-weight: 500;
    white-space: nowrap;
  }
}
</style>
