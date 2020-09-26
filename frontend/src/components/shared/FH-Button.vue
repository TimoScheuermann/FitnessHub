<template>
  <tl-flow class="fh-button" @click.stop="clicked">
    <div class="fh-button--icon" v-if="icon">
      <i :class="'ti-' + icon" />
    </div>
    <div class="fh-button--title" v-if="title">
      {{ title }}
    </div>
  </tl-flow>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHButton extends Vue {
  @Prop() title!: string;
  @Prop() icon!: string;
  @Prop() to!: object;
  @Prop() routeName!: string;

  public clicked(e: MouseEvent) {
    if (this.to) {
      this.$router.push(this.to);
    }
    if (this.routeName) {
      this.$router.push({ name: this.routeName });
    }
    this.$emit('click', e);
  }
}
</script>

<style lang="scss" scoped>
.fh-button {
  background: darken($paragraph, 5%);
  box-shadow: $shadow-light;
  @media (prefers-color-scheme: dark) {
    background: darken($paragraph_dark, 5%);
  }
  display: inline-flex;
  padding: 10px;
  border-radius: $border-radius;
  color: $success;
  cursor: pointer;
  font-weight: 500;
  .fh-button--icon,
  .fh-button--title {
    margin: 0 5px;
  }
  &:hover {
    filter: brightness(120%);
  }
}
</style>
