<template>
  <div class="fh-preview" @click="clicked">
    <div class="media" :style="{ height: height + 'px' }">
      <slot name="media" />
    </div>
    <div class="container">
      <div class="title">{{ title }}</div>
      <tl-flow
        v-if="$slots.default || $slots.action"
        horizontal="space-between"
      >
        <slot />

        <tc-action v-if="$slots.action" :dark="$store.getters.darkmode">
          <slot name="action" />
        </tc-action>
      </tl-flow>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FHPreview extends Vue {
  @Prop() title!: string;
  @Prop({ default: 210 }) height!: number;

  public clicked(e: MouseEvent) {
    this.$emit('click', e);
  }
}
</script>

<style lang="scss" scoped>
.fh-preview {
  position: relative;
  border-radius: $border-radius;
  height: fit-content;
  display: block;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  box-shadow: $shadow;
  &:hover {
    box-shadow: $shadow-hover;
  }

  @media #{$isLight} {
    background: $paragraph;
  }
  @media #{$isDark} {
    background: $color;
  }

  .media {
    /deep/ img,
    /deep/ video {
      border-radius: $border-radius $border-radius 0 0;
      height: 100%;
      width: 100%;
      // max-width: 280px;
      object-fit: cover;
    }
  }
  .container {
    .title {
      overflow-wrap: break-word;
      font-weight: bold;
      font-size: 1.4em;
      position: relative;
      z-index: 10;

      border-radius: 0 0 $border-radius $border-radius;

      @media #{$isLight} {
        background: linear-gradient(
          to bottom,
          rgba($paragraph, 0),
          rgba($paragraph, 1) 25px
        );
      }
      @media #{$isDark} {
        background: linear-gradient(
          to bottom,
          rgba($color, 0),
          rgba($color, 1) 25px
        );
      }

      padding: 10px 20px 20px;
      margin-top: -25px;
    }

    .tl-flow {
      position: relative;
      z-index: 11;
      margin-top: -10px;
      padding: 0 10px 10px 10px;
    }
  }
}
</style>
